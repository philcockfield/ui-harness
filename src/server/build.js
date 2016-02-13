import R from 'ramda';
import Promise from 'bluebird';
import fs from 'fs-extra';
import fsPath from 'path';
import chalk from 'chalk';
import webpackBuilder from './webpack-builder';
import webpackConfig from './webpack-config';
import { formatEntryPaths, trimRootModulePath } from './paths';
import log from '../shared/log';
import * as yamlConfig from './yaml-config';



/**
 * Builds the JS bundle.
 * @param {Object} buildConfig:
 a
 *            NOTE: If not specified, a configuraiton is looked for within the
 *                  projects [.uiharness.yml] file.
 *
 *            -- prod:          Flag indicating if the build should be minified.
 *                              Default: false.
 *            -- outputFolder:  (Optional) Path to the folder to save files to.
 *                              Default: `./build`
 *            -- modules:       Array of { name:entry-path } objects.
 *            -- vendor:        Array of vendor modules.
 *
 * @param {Object} options:
 *
 *           --silent: Flag indicating if log output should be suppressed.
 *                     Default: false.
 *
 */
export default (buildConfig, options = {}) => new Promise((resolve, reject) => {

  // Setup initial conditions.
  const { silent } = options;
  log.silent = silent || false;

  // Ensure there is a build-config.
  if (!buildConfig) {
    // Attempt to load the build-config from the YAML file.
    const config = yamlConfig.load();
    if (!config) {
      const err = 'No build configuration supplied and a `.uiharness.yml` file was not found.';
      log.error();
      log.error(chalk.red(err));
      log.error();
      return reject(new Error(err));
    }
    buildConfig = config.build;
    if (!R.is(Object, buildConfig)) {
      const err = 'The `.uiharness.yml` file must have a `build` section.';
      log.error();
      log.error(chalk.red(err));
      log.error();
      return reject(new Error(err));
    }
  }

  // Extract the vendor array.
  const vendor = buildConfig.vendor || [];
  const isProduction = buildConfig.prod || false;
  const outputFolder = fsPath.resolve(buildConfig.outputFolder || './.build');

  // Initial message.
  let msg = 'Building javascript';
  if (isProduction) { msg += ' (production)'; }
  log.info(chalk.grey(`${ msg }...\n`));

  const buildItem = (filename, entry) => new Promise((resolveItem, rejectItem) => {
    (async () => {
      entry = formatEntryPaths(entry);

      // Prepare the Webpack configuration.
      const config = webpackConfig({
        entry,
        isProduction,
        vendor,
        outputFile: `${ filename }.js`,
      });

      // Build the JS.
      let stats;
      try {
        stats = await webpackBuilder(config);
      } catch (err) {
        return rejectItem(err);
      }

      // Save the file.
      try {
        const save = (file, js) => {
          fs.outputFileSync(fsPath.join(outputFolder, file), js.toString('utf8'));
        };
        save(`${ filename }.js`, stats.modules.app.js);
        save(`vendor.js`, stats.modules.vendor.js);
      } catch (err) {
        return rejectItem(err);
      }

      // Finish up.
      resolveItem({ filename, stats, entry });
    })();
  });


  const logModule = (filename, data, modules) => {
    // console.log("data", data);
    // General information.
    log.info('', chalk.blue(filename));
    log.info(
      chalk.grey('   - size:     '),
      data.size.display, chalk.grey('=>'),
      chalk.magenta(data.zipped.display), chalk.grey('zipped'),
      chalk.grey(isProduction ? '(minified)' : '')
    );

    // List modules/paths.
    modules = modules.map(item => trimRootModulePath(item));
    log.info(chalk.grey('   - input:    '), modules[0] || chalk.magenta('None.'));
    R.takeLast(modules.length - 1, modules).forEach(item => {
      log.info(chalk.grey('               '), item);
    });

    // Output path.
    const outputPath = fsPath.join(outputFolder, `${ filename }.js`);
    log.info(chalk.grey('   - output:   '), trimRootModulePath(outputPath));
    log.info();
  };


  const logModules = (modules, elapsedSeconds) => {
    // Log each built module.
    modules.forEach(item => {
      logModule(item.filename, item.stats.modules.app, item.entry);
    });
    logModule('vendor', R.last(modules).stats.modules.vendor, vendor);
    log.info(chalk.green(`${ elapsedSeconds } seconds`));
  };


  // Start building each item.
  const builders = Object.keys(buildConfig.modules)
    .map(key => buildItem(key, buildConfig.modules[key]));
  Promise.all(builders)
    .then(results => {
      const secs = R.reduce((prev, curr) => prev + curr.stats.buildTime.secs, 0, results);
      const files = results.map(item => fsPath.join(outputFolder, `${ item.filename }.js`));
      logModules(results, secs);

      resolve({ files, secs });
    })
    .catch(err => reject(err));
});

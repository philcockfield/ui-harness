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
import initRelay from '../relay/init-relay';



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
 *            -- graphqlSchema: The path to the GraphQL schema if relay is being used.
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
  const config = yamlConfig.load();
  if (!buildConfig) {
    // Attempt to load the build-config from the YAML file.
    if (!config) {
      const err = 'No build configuration supplied and a `.uiharness.yml` file was not found.';
      log.error();
      log.error(chalk.red(err));
      log.error();
      reject(new Error(err));
      return;
    }
    buildConfig = config.build;
    if (!R.is(Object, buildConfig)) {
      const err = 'The `.uiharness.yml` file must have a `build` section.';
      log.error();
      log.error(chalk.red(err));
      log.error();
      reject(new Error(err));
      return;
    }
  }

  // Prepare for GraphQL/Relay.
  const graphqlSchema = buildConfig.graphqlSchema || config.graphqlSchema;
  const isRelayEnabled = R.is(String, graphqlSchema);
  const prepareRelay = () => new Promise((resolveRelay, rejectRelay) => {
    if (isRelayEnabled) {
      // Ensure the relay babel-plugin knows about the GraphQL schema.
      initRelay(graphqlSchema)
        .then(() => resolveRelay({}))
        .catch(err => rejectRelay(err));
    } else {
      resolveRelay({}); // Relay is not enabled.
    }
  });

  // Extract the vendor array.
  const vendor = buildConfig.vendor || [];
  const isProduction = buildConfig.prod || process.env.NODE_ENV === 'production' || false;
  const outputFolder = fsPath.resolve(buildConfig.outputFolder || './.build');
  const extensions = config.extensions;

  // Initial message.
  const msg = `Building javascript (${ isProduction ? 'production' : 'development' })`;
  log.info(chalk.grey(`${ msg }...\n`));

  const buildItem = (filename, entry) => new Promise((resolveItem, rejectItem) => {
    (async () => {
      entry = formatEntryPaths(entry);

      // Prepare the Webpack configuration.
      const itemConfig = webpackConfig({
        isProduction,
        isRelayEnabled,
        entry,
        vendor,
        outputFile: `${ filename }.js`,
		extensions,
      });

      // Build the JS.
      let stats;
      try {
        stats = await webpackBuilder(itemConfig);
      } catch (err) {
        rejectItem(err);
        return;
      }

      // Save the file.
      try {
        const save = (file, js) => {
          fs.outputFileSync(fsPath.join(outputFolder, file), js.toString('utf8'));
        };
        save(`${ filename }.js`, stats.modules.app.js);
        save('vendor.js', stats.modules.vendor.js);
      } catch (err) {
        rejectItem(err);
        return;
      }

      // Finish up.
      resolveItem({ filename, stats, entry });
      return;
    })();
  });


  const logModule = (filename, data, modules) => {
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


  const logModules = (modules) => {
    // Log each built module.
    modules.forEach(item => {
      logModule(item.filename, item.stats.modules.app, item.entry);
    });
    logModule('vendor', R.last(modules).stats.modules.vendor, vendor);
  };


  // Start building each item.
  const startBuilders = () => Object
    .keys(buildConfig.modules)
    .map(key => buildItem(key, buildConfig.modules[key]));

  prepareRelay()
    .then(() => startBuilders())
    .then(builders => Promise.all(builders))
    .then(results => {
      let secs = R.reduce((prev, curr) => prev + curr.stats.buildTime.secs, 0, results);
      secs = +secs.toFixed(1);
      const files = results.map(item => fsPath.join(outputFolder, `${ item.filename }.js`));

      // Log results.
      logModules(results, secs);
      log.info(chalk.green(`${ secs } seconds`));

      // Save 'stats.json' object.
      const modules = results.reduce((acc, value) => {
        const items = {};
        Object.keys(value.stats.modules).forEach(key => {
          const { file, size, zipped } = value.stats.modules[key];
          items[key] = {
            file,
            size: size.display,
            zipped: zipped.display,
          };
        });
        acc[value.filename] = {
          buildTime: `${ value.stats.buildTime.secs }s`,
          files: items,
        };
        return acc;
      }, {});
      fs.writeJsonSync(fsPath.join(outputFolder, 'stats.json'), {
        buildTime: `${ secs }s`,
        modules,
      });

      // Finish up.
      resolve({ files, secs });
    })
    .catch(err => reject(err));
});

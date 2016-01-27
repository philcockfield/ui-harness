import R from 'ramda';
import Promise from 'bluebird';
import chalk from 'chalk';
import webpackBuilder from './webpack-builder';
import webpackConfig from './webpack-config';
import { formatEntryPaths, trimRootModulePath } from './paths';
import log from '../shared/log';



/**
 * Calculates the size of the JS bundles.
 * @param {Object} options:
 *
 *           --entry:  Required. The entry path(s).
 *
 *           --prod:   Flag indicating if the JS should be built for production (smaller).
 *                     Default: false.
 *
 *           --silent: Flag indicating if log output should be suppressed.
 *                     Default: false.
 *
 * @return {Promise}.
 */
export default (options = {}) => new Promise((resolve, reject) => {
  (async () => {
    // Setup initial conditions.
    const { entry, prod, silent } = options;
    const isProduction = prod || false;
    log.silent = silent || false;

    // Initial message.
    let msg;
    msg = 'Bundling and calculating size of javascript files';
    msg = isProduction ? `${ msg }(production)` : msg;
    msg += '...\n';
    log.info(chalk.grey(msg));

    // Prepare the Webpack configuration.
    const config = webpackConfig({
      entry: formatEntryPaths(entry),
      outputFile: 'specs.js',
      isProduction,
    });

    // Build the JS.
    let stats;
    try {
      stats = await webpackBuilder(config);
    } catch (err) {
      reject(err);
    }

    // Write output.
    log.info(chalk.green('Code Size:'));
    log.info(chalk.grey(' - minified:   '), isProduction);
    log.info(chalk.grey(' - build time: '), stats.buildTime.secs, 'secs');
    log.info();

    const logModule = (key, title, data) => {
      // General information.
      log.info('', chalk.blue(title));
      log.info(
        chalk.grey('   - size:     '),
        data.size.display, chalk.grey('=>'),
        chalk.magenta(data.zipped.display), chalk.grey('zipped')
      );

      // List modules/paths.
      const modules = config.entry[key].map(item => trimRootModulePath(item));
      log.info(chalk.grey('   - modules:  '), modules[0] || chalk.magenta('None.'));
      R.takeLast(modules.length - 1, modules).forEach(item => {
        log.info(chalk.grey('               '), item);
      });

      log.info();
    };
    logModule('app', 'specs', stats.modules.app);
    logModule('vendor', 'vendor', stats.modules.vendor);

    // Finish up.
    log.silent = false;
    resolve(stats);
  })();
});

/* eslint max-len:0 */

import R from 'ramda';
import Promise from 'bluebird';
import chalk from 'chalk';
import fs from 'fs-extra';
import fsPath from 'path';
import webpackConfig from './webpack-config';
import webpackBuilder from './webpack-builder';
import { formatEntryPaths } from './paths';
import log from '../shared/log';

import 'babel-polyfill';




/**
 * Bundles the UIHarness itself and saves it to the [/public/js] folder.
 *
 * @param {Object} options:
 *
 *           --entry:         Required. Path(s) to the files to build.
 *
 *           --output:        Optional. Path to save the output to.
 *
 *           --isProduction:  Optional. Flag indicating if the JS should be build in production mode
 *                            meaning optimizations (like minification) are employed.
 *                            Default: false
 *
 *           --silent:        Optional. Flag indicating if results should be logged.
 *                            Default: false
 *
 * @return {Promise}.
 */
export const bundle = (options = {}) => new Promise((resolve, reject) => {
  // Setup initial conditions.
  const { silent } = options;
  let { entry, output, isProduction } = options;
  if (!entry) { throw new Error(`Entry path(s) must be specified.`); }
  if (!R.is(Array, entry)) { entry = [entry]; }
  isProduction = isProduction || false;
  output = R.is(String, output) && fsPath.resolve(output);
  log.silent = silent || false;

  // Prepare the webpack configuration.
  const config = webpackConfig({
    isProduction,
    entry: formatEntryPaths(entry),
  });

  const logStats = (stats) => {
    log.info(chalk.green('Bundle:'));
    log.info(chalk.grey(' - production: '), isProduction);
    log.info(chalk.grey(' - minified:   '), isProduction);
    log.info(chalk.grey(' - time:       '), stats.buildTime.secs, 'secs');
    log.info(chalk.grey(' - size:       '), stats.size.display, chalk.grey('=>'), stats.zipped.display, chalk.grey('zipped'));
    log.info(chalk.grey(' - saved to:   '), output || false);
    log.info('');
    return stats;
  };

  const save = (stats) => {
    if (output) { fs.outputFileSync(output, stats.js); }
    return stats;
  };

  log.info(chalk.grey(`Building '${ entry }'...`));
  webpackBuilder(config)
    .then(result => save(result))
    .then(result => logStats(result))
    .then(result => resolve(result))
    .catch(err => {
      log.error('Failed to bundle the UIHarness:', err);
      reject(err);
    });
});

import R from 'ramda';
import Promise from 'bluebird';
import chalk from 'chalk';
import express from 'express';
import fsPath from 'path';
import shell from 'shelljs';
import semver from 'semver';
import webpackConfig from './webpack-config';
import webpackDevServer from './webpack-dev-server';
import { formatSpecPaths, rootModulePath, trimRootModulePath } from './paths';
import log from '../shared/log';
import initRelay from '../relay/init-relay';
import * as yamlConfig from './yaml-config';

const REQUIRED_NODE_VERSION = '>=5.5.0';
const ROOT_PATH = rootModulePath();
const NODE_MODULES = fsPath.resolve('./node_modules');
const YAML_CONFIG = yamlConfig.load() || {};

const displayPath = (path) => trimRootModulePath(path);




/**
 * Starts the UIHarness development server.
 *
 * @param {Object} options:
 *
 *    --entry:             Required. Path to the specs files (comma seperated if more than one).
 *
 *    --port:              Optional. The port to start the server on.
 *                         Default: 3030
 *
 *    --proxy:             Optional. An object containing { path, host } mappings
 *                         to proxy server requests to.
 *                         (https://webpack.github.io/docs/webpack-dev-server.html#proxy)
 *
 *   -- graphqlSchema:     Optional. A path to the GraphQL `schema.js` file.
 *                         If not specified Relay will not be enabled.
 *
 * @return {Promise}.
 */
export default (options = {}) => new Promise((resolve, reject) => {
  (async () => {

    // Extract options or default values.
    const entry = options.entry || YAML_CONFIG.entry;
    const env = process.env.NODE_ENV || 'development';
    const port = options.port || YAML_CONFIG.port || 3030;
    const proxy = options.proxy || YAML_CONFIG.proxy;
    let graphqlSchema = options.graphqlSchema || YAML_CONFIG.graphqlSchema;

    // Ensure required values exist.
    if (R.isNil(entry)) { throw new Error(`Entry path(s) must be specified.`); }

    // Ensure the minimum version of node is supported.
    const nodeVersion = semver.clean(shell.exec('node -v', { silent: true }).output);
    if (!semver.satisfies(nodeVersion, REQUIRED_NODE_VERSION)) {
      return reject(new Error(`The UIHarness requires node version ${ REQUIRED_NODE_VERSION }.`));
    }

    // Ensure ES6+ within the specs can be imported.
    require('babel-register');

    // Initialize the Relay/GraphQL schema (if specified).
    const isRelayEnabled = R.is(String, graphqlSchema);
    if (isRelayEnabled) {
      graphqlSchema = graphqlSchema.startsWith('.')
          ? fsPath.join(ROOT_PATH, graphqlSchema)
          : graphqlSchema;
      try {
        await initRelay(graphqlSchema);
      } catch (err) {
        return reject(err);
      }
    }

    // Prepare the Webpack configuration.
    const specs = formatSpecPaths(entry);
    const config = webpackConfig({
      isRelayEnabled,
      entry: specs,
      outputFile: 'specs.js',
    });

    // Create the development server.
    const app = webpackDevServer(config, { proxy });
    app.use('/', express.static(fsPath.resolve(__dirname, '../../public')));

    // Start the server.
    log.info('\n');
    log.info(chalk.grey(`Starting (${ env })...`));
    app.listen(port, () => {
      // Server details.
      const packageJson = require(fsPath.resolve('./package.json'));
      const reactJson = require(fsPath.join(NODE_MODULES, 'react/package.json'));
      const moduleVersion = packageJson.version || '0.0.0';
      log.info(chalk.green('UIHarness:'));
      log.info(chalk.grey(' - module:   '), packageJson.name, chalk.grey(`(v${ moduleVersion })`));
      log.info(chalk.grey(' - port:     '), port);
      log.info(chalk.grey(' - react:    '), `v${ reactJson.version }`);
      if (isRelayEnabled) {
        log.info(chalk.grey(' - schema:   '), displayPath(graphqlSchema));
      }

      // Specs.
      log.info(chalk.grey(' - specs:    '), displayPath(specs[0]) || chalk.magenta('None.'));
      R.takeLast(specs.length - 1, specs).forEach(path => {
        log.info(chalk.grey('             '), displayPath(path));
      });

      // Finish up.
      log.info('');
      resolve({});
    });
  })();
});

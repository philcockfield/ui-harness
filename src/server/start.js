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

const REQUIRED_NODE_VERSION = '>=5.5.0';
const ROOT_PATH = rootModulePath();
const NODE_MODULES = fsPath.resolve('./node_modules');


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
 *   -- graphqlSchema:     Optional. The absolute path to the GraphQL `schema.js`.
 *                         If not specified Relay will not be enabled.
 *
 * @return {Promise}.
 */
export default (options = {}) => new Promise((resolve, reject) => {
  (async () => {
    // Setup initial conditions.
    if (R.isNil(options.entry)) { throw new Error(`Entry path(s) must be specified.`); }

    // Extract options  default values.
    const ENV = process.env.NODE_ENV || 'development';
    const PORT = options.port || 3030;

    // Ensure the minimum version of node is supported.
    const nodeVersion = semver.clean(shell.exec('node -v', { silent: true }).output);
    if (!semver.satisfies(nodeVersion, REQUIRED_NODE_VERSION)) {
      return reject(new Error(`The UIHarness requires node version ${ REQUIRED_NODE_VERSION }.`));
    }

    // Ensure ES6+ within the specs can be imported.
    require('babel-register');

    // Initialize the Relay/GraphQL schema (if specified).
    let { graphqlSchema } = options;
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
    const specs = formatSpecPaths(options.entry);
    const config = webpackConfig({
      isRelayEnabled,
      entry: specs,
      outputFile: 'specs.js',
    });

    // Create the development server.
    const app = webpackDevServer(config, { proxy: options.proxy });
    app.use('/', express.static(fsPath.resolve(__dirname, '../../public')));

    // Start the server.
    log.info('\n');
    log.info(chalk.grey(`Starting (${ ENV })...`));
    app.listen(PORT, () => {
      // Server details.
      const packageJson = require(fsPath.resolve('./package.json'));
      const reactJson = require(fsPath.join(NODE_MODULES, 'react/package.json'));
      const moduleVersion = packageJson.version || '0.0.0';
      log.info(chalk.green('UIHarness:'));
      log.info(chalk.grey(' - module:   '), packageJson.name, chalk.grey(`(v${ moduleVersion })`));
      log.info(chalk.grey(' - port:     '), PORT);
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

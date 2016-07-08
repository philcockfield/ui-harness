import R from 'ramda';
import Promise from 'bluebird';
import chalk from 'chalk';
import express from 'express';
import fsPath from 'path';
import shell from 'shelljs';
import semver from 'semver';
import webpackConfig from './webpack-config';
import webpackDevServer from './webpack-dev-server';
import uiharnessJson from '../../package.json';
import {
  formatSpecPaths,
  rootModulePath,
  trimRootModulePath,
  REACT_PATH,
} from './paths';
import log from '../shared/log';
import initRelay from '../relay/init-relay';
import * as yamlConfig from './yaml-config';

const REQUIRED_NODE_VERSION = '>=5.5.0';
const ROOT_PATH = rootModulePath();
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
 *   -- graphqlSchema:     Optional. A path to the GraphQL `schema.js` or `schema.json` file.
 *                         If not specified Relay will not be enabled.
 *
 * @return {Promise}.
 */
export default (options = {}) => new Promise((resolve, reject) => {
  (async () => {
    // Setup initial conditions.
    const packageJson = require(fsPath.resolve('./package.json'));

    // Extract options or default values.
    const entry = options.entry || YAML_CONFIG.entry;
    const env = process.env.NODE_ENV || 'development';
    const port = options.port || YAML_CONFIG.port || 3030;
    const proxy = options.proxy || YAML_CONFIG.proxy;
    const graphqlSchema = options.graphqlSchema || YAML_CONFIG.graphqlSchema;
    const images = options.images
      || YAML_CONFIG.images
      || { baseUrl: `/${ packageJson.name }/images`, dir: 'images' };
    const cssModules = options.cssModules || YAML_CONFIG.cssModules;

    // Ensure required values exist.
    if (R.isNil(entry) || R.isEmpty(entry)) { throw new Error('Entry path(s) must be specified.'); }

    // Ensure the minimum version of node is supported.
    const nodeVersion = semver.clean(shell.exec('node -v', { silent: true }).stdout);
    if (!semver.satisfies(nodeVersion, REQUIRED_NODE_VERSION)) {
      return reject(new Error(`The UIHarness requires node version ${ REQUIRED_NODE_VERSION }.`));
    }

    // Ensure ES6+ within the specs can be imported.
    require('babel-register');

    // Initialize the Relay/GraphQL schema (if specified).
    const isRelayEnabled = R.is(String, graphqlSchema);
    if (isRelayEnabled) {
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
      cssModules,
    });

    // Create the development server.
    const app = webpackDevServer(config, { proxy });
    app.use('/', express.static(fsPath.resolve(__dirname, '../../public')));

    // Create an end-point to serve images from.
    app.use(images.baseUrl, express.static(fsPath.join(ROOT_PATH, images.dir)));

    // Start the server.
    log.info('\n');
    log.info(chalk.grey(`Starting (${ env })...`));
    app.listen(port, () => {
      // Server details.
      const reactJson = require(fsPath.join(REACT_PATH, 'package.json'));
      const moduleVersion = packageJson.version || '0.0.0';
      const packageName = chalk.magenta(packageJson.name);
      const packageVersion = chalk.grey(`(v${ moduleVersion })`);
      log.info();
      log.info(chalk.green(`UIHarness${ chalk.grey('@') }${ chalk.grey(uiharnessJson.version) }`));
      log.info(chalk.grey(' - module:   '), packageName, packageVersion);
      log.info(chalk.grey(' - port:     '), port);
      log.info(chalk.grey(' - react:    '), `v${ reactJson.version }`);
      if (isRelayEnabled) {
        log.info(chalk.grey(' - graphql:  '), displayPath(graphqlSchema));
      }
      // Specs.
      log.info(chalk.grey(' - specs:    '), displayPath(specs[0]) || chalk.magenta('None.'));
      R.takeLast(specs.length - 1, specs).forEach(path => {
        log.info(chalk.grey('             '), displayPath(path));
      });

      // Images.
      log.info(chalk.grey(' - images:   '), chalk.grey(`${ images.baseUrl } =>`), images.dir);

      // Proxy.
      if (YAML_CONFIG.proxy) {
        const formatProxy = (item) => `${ chalk.grey(item.from, '=>') } ${ item.to }`;
        const proxyItems = Object
          .keys(YAML_CONFIG.proxy)
          .map(key => ({ from: key, to: proxy[key] }));
        log.info(chalk.grey(' - proxy:    '), formatProxy(proxyItems[0]));
        R.takeLast(proxyItems.length - 1, proxyItems).forEach(item => {
          log.info(chalk.grey('             '), formatProxy(item));
        });
      }

      // Finish up.
      log.info('');
      resolve({});
    });
    return undefined;
  })();
});

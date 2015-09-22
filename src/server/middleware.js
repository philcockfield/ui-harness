import _ from "lodash";
import fsPath from "path";
import Promise from "bluebird";
import express from "express";
import compression from "compression";
import webpack from "webpack";
import webpackMiddleware from "webpack-dev-middleware";
import webpackHotMiddleware from "webpack-hot-middleware";
import * as config from "../webpack-config";
import serverMethods from "./server-methods";
import bdd from "../shared/bdd";


const parseSpecs = (paths) => {
    bdd.register();
    paths.forEach(path => { require(path); });
    bdd.unregister();
  };


/**
 * Middleware for running the UIHarness server.
 * @param {object} options: Configuration settings.
 *                          If a {string/array} is passed, that value is set as the `entry`
 *
 *                          - basePath: The base URL path. Default "/".
 *                          - entry: A string or array of strings to entry points of files
 *                                   to pass to WebPack to build for the client.
 *                          - port: The port to run on (default:8080).
 *                          - env:  The environment to run in ("development" / "production").
 *
 * @param callback: Invoked when the JS has been bundled.
 */
export const middleware = (options = {}, callback) => {
  // Convert string or array options into the "entry" path.
  options = _.isString(options) || _.isArray(options) ? { entry: options } : options;
  const PORT = options.port || 8080;
  const ENV = options.env || process.env.NODE_ENV || "development"
  const IS_PRODUCTION = ENV === "production";
  const router = express.Router();

  // Get the webpack configuration settings.
  const webpackConfig = config.browser({ port: PORT, env: ENV });
  router.use(express.static(fsPath.join(__dirname, "../../public"), { maxage: "60 days" }))
  if (IS_PRODUCTION) {
    router.use(compression());
  }

  // Prepare entry paths for the WebPack bundle.
  let entry = options.entry || [];
  if (!_.isArray(entry)) { entry = [entry]; }
  entry = entry.map(path => _.startsWith(path, ".") ? fsPath.resolve(path) : path);
  entry.forEach(path => {
      // Ensure a specific index entry file if a folder was given.
      // NB: Not having an entry file can cause build-errors in WebPack.
      if (!path.endsWith(".js")) { path += "/index.js"; }
      webpackConfig.entry.push(path);
  });

  // Initialize the [describe/it] statements.
  parseSpecs(entry);

  // Prepare webpack JS.
  if (IS_PRODUCTION) {
    // Compile and minify webpack JS for production.
    console.log("webpack bundling...");
    webpack(webpackConfig, (err, stats) => {
      console.log("...webpack bundled into '/public/'.");
      if (err) { throw err; }
      if (_.isFunction(callback)) { callback(router); }
    });

  } else {
    // Create the WebPack compiler and "hot-reloading" dev server.
    const compiler = webpack(webpackConfig);
    router.use(webpackMiddleware(compiler, config.devServer({ port: PORT })));
    router.use(webpackHotMiddleware(compiler));
    if (_.isFunction(callback)) { callback(router); }
  }

  // Initialize the server-methods.
  router.use(serverMethods.middleware);

  // Finish up.
  return router;
};



/**
 * Starts the UIHarness within a development server.
 * @param {object} options: Configuration settings.
 *                          If a {string/array} is passed, that value is set as the `entry`
 *
 *                          - basePath: The base URL path. Default "/".
 *                          - entry: A string or array of strings to entry points of files
 *                                   to pass to WebPack to build for the client.
 *                          - port: The port to run on (default:8080).
 *                          - env:  The environment to run in ("development" / "production").
 *
 * @param callback: Invoked when the server has started.
 */
export const start = (options = {}, callback) => {
  const BASE_PATH = options.basePath || "/";
  const PORT = options.port || 8080;
  const ENV = options.env || process.env.NODE_ENV || "development"

  console.log("");
  console.log(`Starting (${ ENV })...`);

  const startListening = () => {
      app.listen(PORT, () => {
            console.log("");
            console.log("UIHarness:");
            console.log(" - port:", PORT);
            console.log(" - env: ", ENV);
            console.log("");
            if (_.isFunction(callback)) { callback(); }
      });
    };

  const app = express();
  app.use(BASE_PATH, middleware(options, () => { startListening(); }));
};

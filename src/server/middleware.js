import R from "ramda";
import _ from "lodash";
import fs from "fs-extra";
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

const DEFAULT_PORT = 3030;


const parseSpecs = (paths) => {
    bdd.register();
    paths.forEach(path => { require(path); });
    bdd.unregister();
  };


export const readFileSync = (path) => {
  if (fs.existsSync(path)) {
    return fs.readFileSync(path).toString()
  }
};



/**
 * Middleware for running the UIHarness server.
 * @param {object} options: Configuration settings.
 *                          If a {string/array} is passed, that value is set as the `entry`
 *
 *                          - basePath: The base URL path. Default "/".
 *                          - entry: A string or array of strings to entry points of files
 *                                   to pass to WebPack to build for the client.
 *                          - port: The port to run on (default:3030).
 *                          - env:  The environment to run in ("development" / "production").
 *
 * @param callback: Invoked when the JS has been bundled.
 */
export const middleware = (options = {}, callback) => {
  // Convert string or array options into the "entry" path.
  options = _.isString(options) || _.isArray(options) ? { entry: options } : options;
  const PORT = options.port || DEFAULT_PORT;
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
  if (entry.length === 0) {
    if (fs.existsSync(fsPath.resolve("./specs"))) { entry.push("./specs"); }
    if (fs.existsSync(fsPath.resolve("./src/specs"))) { entry.push("./src/specs"); }
  }
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
 *                          If a number if passed it is assumed to be the port.
 *
 *                          - basePath: The base URL path. Default "/".
 *                          - entry:    A string or array of strings to entry points of files
 *                                      to pass to WebPack to build for the client.
 *                          - port:     The port to run on (default:3030).
 *                          - env:      The environment to run in ("development" / "production").
 *                          - babel:    Instructions to regsiter the "babel" transpiler.
 *                                        - false/undefined:  Not registered.
 *                                        - true:             Registered with defaults.
 *                                        - <number>:         The babel "stage" to register with.
 *
 * @param callback: Invoked when the server has started.
 */
export const start = (options = {}, callback) => {
  // Wrangle arguments.
  if (R.is(String, options) || R.is(Array, options)) { options = { entry: options }; };
  if (R.is(Number, options)) { options = { port: options }; }

  const BASE_PATH = options.basePath || "/";
  const PORT = options.port || DEFAULT_PORT;
  const ENV = options.env || process.env.NODE_ENV || "development"
  const BABEL = options.babel || false;

  // Register babel if required.
  if (BABEL) {
    const compilerOptions = {};
    if (R.is(Number, BABEL)) { compilerOptions.stage = BABEL; }
    require("babel/register")(compilerOptions);
  }

  // Start the server.
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




/**
 * Creates default project structure (if not present)
 * and starts the server.
 */
export const init = (options = {}, callback) => {

  // Ensure the specs folder exists.
  const specsPath = fsPath.resolve("./specs/index.js");
  if (!fs.existsSync(specsPath)) {
    const js = "";
    fs.outputFileSync(specsPath, js);
  }

  // Prepare the entry path.
  let entry = options.entry;
  if (!_.isArray(entry)) { entry = [entry]; }
  entry = _.chain(entry).compact(entry).flatten(entry).value();
  entry.push("./specs");
  options.entry = entry;

  // Start the server.
  start(options, callback);
};

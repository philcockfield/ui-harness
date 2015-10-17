import R from "ramda";
import chalk from "chalk";
import fs from "fs-extra";
import fsPath from "path";
import Promise from "bluebird";
import express from "express";
import compression from "compression";
import webpack from "webpack";
import webpackMiddleware from "webpack-dev-middleware";
import webpackHotMiddleware from "webpack-hot-middleware";
import * as config from "../webpack-config";
import restService from "./rest-service";
import bdd from "../shared/bdd";

const MODULE_PATH = fsPath.join(__dirname, "../..");
const DEFAULT_PORT = 3030;
const server = {};


const parseSpecs = (paths) => {
    bdd.register();
    paths.forEach(path => require(path))
    bdd.unregister();
  };


export const readFileSync = (path) => {
    if (fs.existsSync(path)) {
      return fs.readFileSync(path).toString()
    }
  };


const formatEntryPaths = (entry) => {
    entry = entry || [];
    if (!R.is(Array, entry)) { entry = [entry]; }
    if (entry.length === 0) {
      const addIfExists = (path) => {
          if (fs.existsSync(fsPath.resolve(path))) { entry.push(path); }
        };
      addIfExists("./specs");
      addIfExists("./src/specs");
    }
    return entry
      // Ensure there is a specific index.js entry file if only a folder was given.
      // NB: Not having a specific entry file can cause build-errors in WebPack.
      .map(path => path.endsWith(".js") ? path : `${ path }/index.js`);
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
  options = R.is(String, options) || R.is(Array, options) ? { entry: options } : options;
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
  const entryPaths = formatEntryPaths(options.entry)
          .map(path => path.startsWith(".") ? fsPath.resolve(path) : path)
          .filter(path => fs.existsSync(path));
  entryPaths.forEach(path => webpackConfig.entry.push(path));

  // Initialize the [describe/it] statements.
  parseSpecs(entryPaths);

  // Prepare webpack JS.
  if (IS_PRODUCTION) {
    // Compile and minify webpack JS for production.
    console.log("webpack bundling...");
    webpack(webpackConfig, (err, stats) => {
      console.log("...webpack bundled into '/public/'.");
      if (err) { throw err; }
      if (R.is(Function, callback)) { callback(router); }
    });

  } else {
    // Create the WebPack compiler and "hot-reloading" dev server.
    const compiler = webpack(webpackConfig);
    router.use(webpackMiddleware(compiler, config.devServer({ port: PORT })));
    router.use(webpackHotMiddleware(compiler));
    if (R.is(Function, callback)) { callback(router); }
  }

  // Initialize the server-methods.
  router.use(restService.middleware);

  // Finish up.
  return router;
};


const isPortTaken = (port, callback) => {
  if (!R.is(Function, callback)) { callback = () => 0; }
  const net = require("net");
  const tester = net.createServer()
  .once("error", (err) => {
    if (err.code != "EADDRINUSE") { return callback(err); }
    callback(null, true);
  })
  .once("listening", () => {
    tester
      .once("close", function() { callback(null, false) })
      .close();
  })
  .listen(port);
}



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
 * @return Promise.
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

  // Ensure each "entry" path exists.
  let entryPaths = formatEntryPaths(options.entry);
  entryPaths = entryPaths.length === 0 ? ["./src/specs/index.js"] : entryPaths;
  entryPaths
      .map(path => fsPath.resolve(path))
      .filter(path => !fs.existsSync(path))
      .forEach(path => {
        fs.copySync(`${ MODULE_PATH }/templates/entry-index.js`, path)
      });

  console.log("");
  console.log(chalk.grey(`Starting (${ ENV })...`));
  const logStarted = () => {
        console.log("");
        console.log(chalk.green("UIHarness:"));
        console.log(chalk.grey(" - port: "), PORT);
        console.log(chalk.grey(" - env:  "), ENV);
        console.log(chalk.grey(" - specs:"), entryPaths[0] || chalk.magenta("None."));
        R.takeLast(entryPaths.length - 1, entryPaths).forEach(path => {
          console.log(chalk.grey("         "), path);
        });
        console.log("");
      };

  // Start the server if the port is not already in use.
  return new Promise((resolve, reject) => {
      const app = express();
      isPortTaken(PORT, (err, isInUse) => {
            if (isInUse) {
              console.log(chalk.red(`Port ${ PORT } is already in use.`));
              console.log("");
              reject(new Error("Port already in use."));
            } else {
              app.use(BASE_PATH, middleware(options, () => {
                server.options = options;
                server.instance = app.listen(PORT, () => {
                  logStarted();
                  resolve();
                });
              }));
            }
          });
  });
};



/**
 * Stops the currently running server.
 * @return {bool} true if the server was stopped,
 *                or false if the server was not running.
 */
export const stop = () => {
  console.log("STOP");
  if (server.instance) {
    server.instance.close();
    delete server.instance;
    delete server.options;
    return true;
  } else {
    return false; // Wasn't running.
  }
};



/**
 * Restarts the server.
 * @return Promise.
 */
export const restart = () => {
  return new Promise((resolve, reject) => {
      if (!server.instance) {
        resolve(false); // Server not running.
      } else {
        const options = server.options;
        stop();
        start(options)
          .then(() => resolve())
          .catch(err => reject(err));
      }
  });
};

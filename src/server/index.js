import _ from "lodash";
import fsPath from "path";
import Promise from "bluebird";
import express from "express";
import webpack from "webpack";
import webpackMiddleware from "webpack-dev-middleware";
import webpackHotMiddleware from "webpack-hot-middleware";
import * as config from "../webpack-config";
import * as serverMethods from "./serverMethods";
import bdd from "../shared/bdd";




const parseSpecs = (paths) => {
    bdd.register();
    paths.forEach(path => { require(path); });
    bdd.unregister();
};




/**
 * Starts the UIHarness within a development server.
 * @param {object} options: Configuration settings.
 *                          If a {string/array} is passed, that value is set as the `entry`
 *
 *                          - entry: A string or array of strings to entry points of files
 *                                   to pass to WebPack to build for the client.
 *                          - port: The port to run on (default:8080).
 *                          - env:  The environment to run in ("development" / "production").
 * @param callback: Invokd when the server has started.
 */
export const start = (options = {}, callback) => {
  console.log("Starting...");

  const PORT = options.port || 8080;
  const ENV = options.env || process.env.NODE_ENV || "development"
  const IS_PRODUCTION = ENV === "production";
  const webpackConfig = config.browser({ port: PORT, env: ENV });

  console.log("ENV", ENV);

  // Prepare the server.
  const app = express();
  const startListening = () => {
      app.listen(PORT, () => {
            console.log("Started.");
            console.log("");
            console.log("UIHarness");
            console.log(" - port:", PORT);
            console.log(" - env: ", ENV);
            console.log("");
            if (_.isFunction(callback)) { callback(); }
      });
    };

  // Setup routing.
  const get = (route, file) => {
      file = fsPath.join(__dirname, `../../public/${ file || route }`);
      app.get(route, (req, res) => { res.sendFile(file); });
  };
  get("/", "index.html");
  get("/normalize.css");
  get("/favicon.ico");
  if (IS_PRODUCTION) {
    get("/public/bundle.js", "bundle.js");
  }

  // Ensure the options is an object.
  if (_.isString(options) || _.isArray(options)) {
    // A string or object was given, convert it to the "entry" option.
    options = { entry: options };
  }

  // Prepare entry paths for the WebPack compiler.
  let entry = options.entry || [];
  if (!_.isArray(entry)) { entry = [entry]; }
  entry = entry.map(path => { return _.startsWith(path, ".") ? fsPath.resolve(path) : path; });
  entry.forEach(path => { webpackConfig.entry.push(path); });

  // Iniitalize the [describe/it] statements.
  parseSpecs(entry);


  // Configure the server methods (REST API).
  // serverMethods.init({ connect:app });


  // Prepare webpack JS.
  if (IS_PRODUCTION) {
    // Compile and minify webpack JS for production.
    console.log("webpack bundling...");
    webpack(webpackConfig, (err, stats) => {
      console.log("...webpack bundled.");
      if (err) { throw err; }
      startListening();
    });

  } else {
    // Create the WebPack compiler and "hot-reloading" dev server.
    const compiler = webpack(webpackConfig);
    app.use(webpackMiddleware(compiler, config.devServer({ port: PORT })));
    app.use(webpackHotMiddleware(compiler));
    startListening();
  }
};

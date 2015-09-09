import _ from "lodash";
import fsPath from "path";
import Promise from "bluebird";
import chalk from "chalk";
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
 */
export const start = (options = {}) => {
  const app = express();
  const PORT = options.port || 8080;
  const webpackConfig = config.browser({ port: PORT });

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

  // Create the WebPack compiler and "hot-reloading" dev server.
  const compiler = webpack(webpackConfig);
  app.use(webpackMiddleware(compiler, config.devServer({ port: PORT })));
  app.use(webpackHotMiddleware(compiler));

  // Iniitalize the [describe/it] statements.
  parseSpecs(entry);

  // Configure the server methods (REST API).
  serverMethods.init({ connect:app });

  // Serve static files.
  const get = (route, file) => {
      file = fsPath.resolve(`./public/${ file || route }`);
      app.get(route, (req, res) => { res.sendFile(file); });
  };
  get("/", "index.html");
  get("/normalize.css");
  get("/favicon.ico");

  // Start the server. -----------------------------------------------------------
  app.listen(PORT, () => {
        const HR = chalk.cyan(_.repeat("-", 80));
        console.log(HR);
        console.log(chalk.grey("UIHarness running on"), chalk.cyan(`localhost:${ PORT }`));
        console.log(HR, "\n");
  });
};

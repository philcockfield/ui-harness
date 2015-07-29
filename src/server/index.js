import _ from "lodash";
import fsPath from "path";
import Promise from "bluebird";
import chalk from "chalk";
import express from "express";
import webpack from "webpack";
import webpackMiddleware from "webpack-dev-middleware";
import webpackHotMiddleware from "webpack-hot-middleware";
import immutable from "immutable";
import * as config from "./webpack.config";
import * as serverMethods from "./serverMethods";
import bdd from "js-bdd";


const PORT = config.PORT;

const parseSpecs = (paths) => {
    const BDD_METHODS = ['describe', 'before', 'it', 'section'];
    BDD_METHODS.forEach(name => { global[name] = bdd[name] });
    paths.forEach(path => { require(path); });
    BDD_METHODS.forEach(name => { delete global[name] }); // Clean up global namespace.
};



/**
 * Starts the UIHarness within a development server.
 * @param {object} options: Configuration settings.
 *                          If a {string/array} is passed, that value is set as the `entry`
 *
 *                          - entry: A string or array of strings to entry points of files
 *                                   to pass to WebPack to build for the client.
 */
export const start = (options = {}) => {
  const app = express();
  const webpackOptions = immutable.fromJS(config.compiler).toJS();

  // Ensure the options is an object.
  if (_.isString(options) || _.isArray(options)) {
    // A string or object was given, convert it to the "entry" option.
    options = { entry: options };
  }

  // Prepare entry paths (WebPack).
  let entry = options.entry || [];
  if (!_.isArray(entry)) { entry = [entry]; }
  entry = entry.map(path => { return _.startsWith(path, ".") ? fsPath.resolve(path) : path; });
  entry.forEach(path => { webpackOptions.entry.push(path); });

  // Create the WebPack compiler and hot-reloading dev server.
  const compiler = webpack(webpackOptions);
  app.use(webpackMiddleware(compiler, config.options));
  app.use(webpackHotMiddleware(compiler));

  // Configure the server methods (REST API).
  parseSpecs(entry);
  serverMethods.init({ connect:app });

  // Serve static files.
  app.get("/", function (req, res) { res.sendFile(`${ __dirname }/index.html`); });
  app.get("/normalize.css", function (req, res) { res.sendFile(`${ __dirname }/normalize.css`); });


  // Start the server. -----------------------------------------------------------
  app.listen(PORT, () => {
        const HR = chalk.cyan(_.repeat("-", 80));
        console.log(HR);
        console.log(chalk.grey("UIHarness running on"), chalk.cyan(`localhost:${ PORT }`));
        console.log(HR, "\n");
  });
};

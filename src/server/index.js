import _ from "lodash";
import fsPath from "path";
import Promise from "bluebird";
import chalk from "chalk";
import express from "express";
import webpack from "webpack";
import webpackMiddleware from "webpack-dev-middleware";
import webpackHotMiddleware from "webpack-hot-middleware";
import immutable from "immutable";
import rest from "rest-methods";
import * as config from "./webpack.config";

const PORT = config.PORT;


/**
 * Starts the UIHarness within a development server.
 * @param {object} options: Configuration settings.
 *                          If a {string/array} is passed, that value is set as the `entry`
 *
 *                          - entry: A string or array of strings to entry points of files
 *                                   to pass to WebPack to build for the client.
 */
export var start = (options = {}) => {
  const app = express();

  // Ensure the options is an object.
  if (_.isString(options) || _.isArray(options)) {
    // Set the default primitive value as the entry option.
    options = { entry: options };
  }

  // Prepare configuration.
  var webpackOptions = immutable.fromJS(config.compiler).toJS();
  var entry = options.entry || [];
  if (!_.isArray(entry)) { entry = [entry]; }
  entry.forEach((path) => {
      if (_.startsWith(path, ".")) { path = fsPath.resolve(path); }
      webpackOptions.entry.push(path);
  });

  // Create the WebPack compiler and hot-reloading dev server.
  var compiler = webpack(webpackOptions);
  app.use(webpackMiddleware(compiler, config.options));
  app.use(webpackHotMiddleware(compiler));

  // Configure the server methods.
  let server = rest({
    name: "ui-harness",
    connect: app,
    basePath: "/api",
    version: "1.0.0"
  });

  // TEMP
  server.methods({
    "foo": function(p1, p2) {
      // throw new Error("ouch")
      console.log("-------------------------------------------");
      console.log("this", this);
      console.log(this.verb);
      console.log("this.url", this.url);
      console.log("invoked foo!");
      console.log("p1: ", p1);
      console.log("p2: ", p2);
      console.log("");

      // return {foo:123};
      return new Promise((resolve, reject) => {
        resolve({ verb: this.verb, date: new Date() });
        reject(new Error("Bummer"));
      });
    },
    "foo/method1": {
      url: "/yo",
      get: function() { return "method1"; },
      put: (text) => { return text; }
    },

    "myError": function(text, number) {
      // throw new Error("My fail");
      this.throw(503, "Ouch!");
      return { text: text, number: number };
    },

    "myPromiseError": () => {
      return new Promise((resolve, reject) => {
        reject(new Error("Promise fail"));
      });
    },

    "complex": {
      url: "thing/:id",
      put: function(id, number) {
        console.log("this.url", this.url);
        console.log("id", id);
        console.log("number", number);
        return id;
      }
    }
  });



  // Serve host HTML page from root.
  app.get("/", function (req, res) { res.sendFile(`${ __dirname }/index.html`); });



  // Start the server. -----------------------------------------------------------
  //
  app.listen(PORT, () => {
        const HR = chalk.cyan(_.repeat("-", 80));
        console.log(HR);
        console.log(chalk.grey("UIHarness running on"), chalk.cyan(`localhost:${ PORT }`));
        console.log(HR, "\n");
  });
};

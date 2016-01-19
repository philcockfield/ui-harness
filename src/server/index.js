import R from "ramda";
import Promise from "bluebird";
import chalk from "chalk";
import express from "express";
import fsPath from "path";
import webpack from "webpack";
import webpackConfig from "./webpack-config";
import webpackStats from "./webpack-stats";
import webpackDevServer from "./webpack-dev-server";
import specPaths from "./spec-paths";
import log from "./log";



const listenP = (app, port) => {
    return new Promise((resolve) => app.listen(port, () => resolve()));
  };



/**
 * Starts the UIHarness development server.
 * @param {Object} options
 *           --entry: Required. Path to the specs files (comma seperated if more than one).
 *                    If not present the server is not started.
 *                    Example: --entry ./src/specs
 *
 *           --port:  Optional. The port to start the server on.
 *                    Default: 3030
 *
 *           --babel: Optional. The babel "stage" to transpile using.
 *                    See: https://babeljs.io/docs/usage/experimental/
 *                    Default: 1
 *
 * @return {Promise}.
 */
export const start = (options = {}) => {
  return new Promise((resolve, reject) => {
    let buildStats, isStarted;

    // Extract options  default values.
    const ENV = process.env.NODE_ENV || "development"
    const PORT = options.port || 3030;
    const BABEL_STAGE = options.babel || 1;

    // Prepare the Webpack configuration.
    // const specs = specPaths(options.entry);
    console.log("TEMP add specs array");
    const specs = []; // TEMP
    const entry = R.flatten([
      fsPath.join(__dirname, "../client/entry.js"),
      specs
    ]);
    const config = webpackConfig({ entry });

    // Create the development server.
    const app = webpackDevServer(config);
    app.use("/", express.static(fsPath.resolve(__dirname, "../../public")));

    // Build JS to determine the file-size
    const gettingBuildStats = webpackStats(config, { production: true })
        .then(result => buildStats = result)
        .catch(err => {
            log.error("Failed to :", err);
            reject(err);
        });

    console.log("TODO", "Only build stats for built specs.");
    console.log("TODO", "Initiate the babel register if required");

    // Start the server.
    log.info("");
    log.info(chalk.grey(`Starting (${ ENV })...`));
    const startingServer = listenP(app, PORT);

    // Finish up.
    Promise.all([startingServer, gettingBuildStats])
      .then(() => {

          // Server details.
          const packageJson = require(fsPath.resolve("./package.json"));
          log.info("");
          log.info(chalk.green("UIHarness:"));
          log.info(chalk.grey(" - module: "), packageJson.name, chalk.grey(`(v${ packageJson.version || "0.0.0" })`));
          log.info(chalk.grey(" - port:   "), PORT);
          log.info(chalk.grey(" - env:    "), ENV);
          log.info(chalk.grey(" - time:   "), buildStats.buildTime.secs, "secs");
          log.info(chalk.grey(" - size:   "), buildStats.size.display);
          log.info(chalk.grey(" - zipped: "), buildStats.zipped.display);

          // Specs.
          log.info(chalk.grey(" - specs:  "), specs[0] || chalk.magenta("None."));
          R.takeLast(specs.length - 1, specs).forEach(path => {
            log.info(chalk.grey("           "), path);
          });

          // Finish up.
          log.info("");
          resolve({});
      })
  });
};

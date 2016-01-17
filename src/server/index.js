import R from "ramda";
import chalk from "chalk";
import express from "express";
import fsPath from "path";
import webpack from "webpack";
import WebpackDevServer from "webpack-dev-server";
import log from "./log";


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
 */
export const start = (options = {}) => {
  // Setup initial conditions.

  // Extract options  default values.
  const ENV = process.env.NODE_ENV || "development"
  const SPECS_ENTRY = options.entry;
  const PORT = options.port || 3030;
  const BABEL_STAGE = options.babel || 1;

  // Entry JS paths to build.
  const entryPaths = [];
  entryPaths.push(fsPath.join(__dirname, "../client/index.js"));

  // Webpack compiler.
  const compiler = webpack({
    entry: entryPaths,
    module: {
      loaders: [
        {
          exclude: /node_modules/,
          loader: "babel",
          query: {
            // plugins: ["./build/babelRelayPlugin"],
          },
          test: /\.js$/,
        }
      ]
    },
    output: { filename: "app.js", path: "/" }
  });

  // Development server.
  const app = new WebpackDevServer(compiler, {
    // noInfo: true, // Suppress boring information.
    // quiet: true, // Don’t output anything to the console.

    contentBase: "/public/",
    // proxy: {"/graphql": `http://localhost:${GRAPHQL_PORT}`},
    publicPath: "/js/",
    stats: { colors: true }
  });

  // Serve static resources.
  app.use("/", express.static(fsPath.resolve(__dirname, "../../public")));

  // Start the server.
  log.info("");
  log.info(chalk.grey(`Starting (${ ENV })...`));
  app.listen(PORT, () => {
        const packageJson = require(fsPath.resolve("./package.json"));
        log.info("");
        log.info(chalk.green("UIHarness:"));
        log.info(chalk.grey(" - module: "), packageJson.name, chalk.grey(`(v${ packageJson.version || "0.0.0" })`));
        log.info(chalk.grey(" - port:   "), PORT);
        log.info(chalk.grey(" - env:    "), ENV);
        log.info(chalk.grey(" - specs:  "), entryPaths[0] || chalk.magenta("None."));
        R.takeLast(entryPaths.length - 1, entryPaths).forEach(path => {
          log.info(chalk.grey("           "), path);
        });
        log.info("");
  });
};

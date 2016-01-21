import R from "ramda";
import webpack from "webpack";
import fs from "fs-extra";
import fsPath from "path";
import { rootModulePath } from "./paths";

const NODE_MODULES_PATH = fsPath.join(rootModulePath(), "node_modules");


const babelLoader = (extension) => {
      // See: https://github.com/babel/babel-loader#options
      return {
        loader: "babel",
        test: extension,
        exclude: /(node_modules|bower_components)/,
        query: {
          // plugins: ["./build/babelRelayPlugin"],
        },
      };
    };


const modulePath = (path) => {
      const paths = [fsPath.resolve("./node_modules", path), fsPath.join(NODE_MODULES_PATH, path)];
      return R.find(path => fs.existsSync(path), paths);
    };



/**
 * Creates a Webpack compiler instance.
 *
 * @param {Object} options:
 *            - entry:          Array of entry paths.
 *            - isProduction:   Flag indicating if the builder is in production mode.
 *                              Default false.
 *
 * @return {Object} compiler.
 */
export default (options = {}) => {
  const isProduction = options.isProduction || false;

  const config = {
    entry: options.entry,
    output: { path: "/", filename: "bundle.js" },
    module: {
      loaders: [
        babelLoader(/\.js$/),
        babelLoader(/\.jsx$/),
        { test: /\.json$/, loader: "json-loader" },
        { test: /\.(png|svg)$/, loader: 'url-loader' }
      ]
    },
    devtool: isProduction ? undefined : "cheap-module-eval-source-map",
    resolve: {
      moduleDirectories: NODE_MODULES_PATH,
      extensions: ["", ".js", ".jsx", ".json"],
      /*
      Aliases
          Ensures common libraries are:
            - Module code loaded only once (de-duped)
            - Single version of modules are loaded.
      */
      alias: {
        "ramda": modulePath("ramda"),
        "react": modulePath("react"),
        "react-dom": modulePath("react-dom"),
        "immutable": modulePath("immutable"),
        "bluebird": modulePath("bluebird"),
        "js-util": modulePath("js-util")
      },
      resolveLoader: { fallback: NODE_MODULES_PATH }
    },
    plugins: [
      // https://github.com/webpack/docs/wiki/optimization#deduplication
      new webpack.optimize.DedupePlugin(),

      // [Moment.js] only load subset of locales to reduce size.
      //   See - http://stackoverflow.com/a/25426019/1745661
      new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/)
    ]
  };

  // Configure optional plugins.
  //    See - https://webpack.github.io/docs/list-of-plugins.html
  //        - https://github.com/webpack/docs/wiki/optimization
  //
  const addPlugin = (flag, plugin) => { if (flag === true) { config.plugins.push(plugin); }}
  addPlugin(isProduction, new webpack.optimize.UglifyJsPlugin({ minimize: true }));
  addPlugin(isProduction, new webpack.optimize.OccurrenceOrderPlugin(true));

  // Finish up.
  return config;
};

import R from "ramda";
import webpack from "webpack";
import fs from "fs-extra";
import fsPath from "path";


const NODE_MODULES_PATH = fsPath.resolve("node_modules");


const babelLoader = (extension) => {
      // See: https://github.com/babel/babel-loader#options
      return {
        loader: "babel-loader",
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
 *           - entry: Array of entry paths.
 *
 * @return {Object} compiler.
 */
export default (options = {}) => {
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
    devtool: "cheap-module-eval-source-map",
    plugins: [],
    resolve: {
      root: NODE_MODULES_PATH,
      fallback: NODE_MODULES_PATH,
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
        "lodash": modulePath("lodash"),
        "immutable": modulePath("immutable"),
        "bluebird": modulePath("bluebird"),
        "js-util": modulePath("js-util"),
        "color": modulePath("color")
      },
      resolveLoader: { fallback: NODE_MODULES_PATH }
    },
  };

  // Finish up.
  return config;
};

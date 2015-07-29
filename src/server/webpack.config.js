/*
See:

    https://github.com/webpack/webpack-dev-middleware
    https://www.npmjs.com/package/webpack-hot-middleware

    https://github.com/kriasoft/react-starter-kit/blob/master/webpack.config.js

*/
import webpack from "webpack";
import fsPath from "path";

export const PORT = 8080;
const NODE_MODULES_PATH = fsPath.join(__dirname, "../../node_modules");
const LOADER_EXCLUDE = /(node_modules|bower_components)/;

const modulePath = (path) => fsPath.join(NODE_MODULES_PATH, path);

const babelLoader = (extension) => {
  // See: https://github.com/babel/babel-loader#options
  return {
    test: extension,
    exclude: LOADER_EXCLUDE,
    loader: 'babel-loader',
    query: {
      optional: ['runtime'],
      cacheDirectory: true,
      stage: 1  // Experimental:level-1
                // Allows for @decorators
                // See: http://babeljs.io/docs/usage/experimental/
    }
  };
};


export const compiler = {
  entry: [
    "webpack/hot/dev-server",
    "webpack-hot-middleware/client",
    fsPath.join(__dirname, "../client/index.js")
  ],

  output: {
    filename: "bundle.js",
    path: "/",
    publicPath: `http://localhost:${ PORT }/public`
  },

  devtool: "#cheap-module-eval-source-map",

  plugins: [
    // Hot reload plugins:
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],

  resolve: {
    fallback: NODE_MODULES_PATH,
    extensions: ["", ".js", ".jsx", ".json"],

    /*
    Aliases
    Ensure common libraries are:
      - Module code loaded only once (de-duped)
      - Single version of modules are loaded.
    */
    alias: {
      "react": modulePath("react"),
      "lodash": modulePath("lodash"),
      "immutable": modulePath("immutable"),
      "bluebird": modulePath("bluebird"),
      "js-util": modulePath("js-util"),
      "color": modulePath("color")
    }
  },
  resolveLoader: { fallback: NODE_MODULES_PATH },

  module: {
    loaders: [
      babelLoader(/\.js$/),
      babelLoader(/\.jsx$/),
      { test: /\.json$/, loader: "json-loader" }
    ]
  }
};



export const options = {
  noInfo: true, // Suppress boring information.
  quiet: false, // Don’t output anything to the console.
  lazy: false,
  watchOptions: {
    aggregateTimeout: 300,
    poll: true
  },
  publicPath: compiler.output.publicPath,
  stats: { colors: true }
};

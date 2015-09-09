/*
See:

    https://github.com/webpack/webpack-dev-middleware
    https://www.npmjs.com/package/webpack-hot-middleware

    https://github.com/kriasoft/react-starter-kit/blob/master/webpack.config.js

*/

var webpack = require("webpack");
var fsPath = require("path");

var NODE_MODULES_PATH = fsPath.resolve("./node_modules");
var LOADER_EXCLUDE = /(node_modules|bower_components)/;

function modulePath(path) { return fsPath.join(NODE_MODULES_PATH, path); }
function babelLoader (extension) {
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
                // For example, used by @Radium (CSS)
    }
  };
};


var PLUGINS = [
  // Hot reload plugins:
  new webpack.optimize.OccurenceOrderPlugin(),
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoErrorsPlugin()
];


var RESOLVE = {
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
};

var RESOLVE_LOADER = { fallback: NODE_MODULES_PATH };

var MODULE = {
  loaders: [
    babelLoader(/\.js$/),
    babelLoader(/\.jsx$/),
    { test: /\.json$/, loader: "json-loader" },
    { test: /\.(png|svg)$/, loader: 'url-loader' }
  ]
};



function publicPath(options) {
  options = options || {};
  var port = options.port || 8080;
  return "http://localhost:" + port + "/public";
};



function devServer(options) {
  return {
    noInfo: true, // Suppress boring information.
    quiet: false, // Don’t output anything to the console.
    lazy: false,
    watchOptions: {
      aggregateTimeout: 300,
      poll: true
    },
    publicPath: publicPath(options),
    stats: { colors: true }
  };
};



function compilerSettings(entry, output) {
  return {
    entry: entry,
    output: output,
    devtool: "#cheap-module-eval-source-map",
    plugins: PLUGINS,
    resolve: RESOLVE,
    resolveLoader: RESOLVE_LOADER,
    module: MODULE
  };
};



function browser(options) {
  var entry = [
    "webpack/hot/dev-server",
    "webpack-hot-middleware/client",
    fsPath.resolve("./src/client/index.js")
  ];
  var output = {
    filename: "bundle.js",
    path: "/",
    publicPath: publicPath(options)
  };
  return compilerSettings(entry, output);
};



// function server(options) {
//   var entry = [
//     fsPath.resolve("./src/client/index.js")
//   ];
//   var output = {
//     filename: "client.bundle.js",
//     path: fsPath.resolve("./build"),
//     target: "node",
// 		libraryTarget: "commonjs2"
//   };
//   return compilerSettings(entry, output);
// };



// ----------------------------------------------------------------------------
module.exports = {
  devServer: devServer,
  browser: browser
};

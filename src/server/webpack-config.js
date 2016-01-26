import webpack from 'webpack';
import fsPath from 'path';
import { rootModulePath } from './paths';
import babelRelayPlugin from '../relay/babel-relay-plugin';


// Hack: Prevent error with `fetch` which attempts to look for a `self` object.
//       This occurs when parsing the `react-relay` module on the server while compiling.
global.self = { fetch: null };


const NODE_MODULES_PATH = fsPath.join(rootModulePath(), 'node_modules');
const UIHARNESS_ENTRY = fsPath.join(__dirname, '../client/entry');


const babelLoader = (extension) => ({
  // See: https://github.com/babel/babel-loader#options
  loader: 'babel',
  test: extension,
  exclude: /(node_modules|bower_components)/,
  query: {
    // plugins: [babelRelayPlugin('../../example/relay/data/schema.json')],
    // plugins: [fsPath.resolve("./src/relay/babelRelayPlugin")],
  },
});



/**
 * Creates a Webpack compiler instance.
 *
 * @param {Object} options:
 *            -- entry:           Array of entry paths.
 *            -- isProduction:    Flag indicating if the builder is in production mode.
 *                                Default false.
 *            -- outputFile:      The name of the output file.
 *                                Default: 'bundle.js'.
 *
 * @return {Object} compiler.
 */
export default (options = {}) => {
  const isProduction = options.isProduction || false;
  const outputFile = options.outputFile || 'bundle.js';

  const config = {
    entry: {
      app: options.entry,
      vendor: ['react', 'react-dom', 'react-relay', UIHARNESS_ENTRY],
    },
    output: { path: '/', filename: outputFile },
    module: {
      loaders: [
        babelLoader(/\.js$/),
        babelLoader(/\.jsx$/),
        { test: /\.json$/, loader: 'json-loader' },
        { test: /\.(png|svg)$/, loader: 'url-loader' },
      ],
    },
    devtool: isProduction ? undefined : 'cheap-module-eval-source-map',
    resolve: {
      moduleDirectories: NODE_MODULES_PATH,
      extensions: ['', '.js', '.jsx', '.json'],
      resolveLoader: { fallback: NODE_MODULES_PATH },
    },
    plugins: [
      // Remove duplicate code.
      //    See - https://github.com/webpack/docs/wiki/optimization#deduplication
      // new webpack.optimize.DedupePlugin(),

      // [Moment.js] only load subset of locales to reduce size.
      //    See - http://stackoverflow.com/a/25426019/1745661
      new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/),

      // Break out common libs into their own code-chunk.
      //    See - https://webpack.github.io/docs/code-splitting.html#split-app-and-vendor-code
      new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', filename: 'vendor.js' }),
    ],
  };

  // Configure optional plugins.
  //    See - https://webpack.github.io/docs/list-of-plugins.html
  //        - https://github.com/webpack/docs/wiki/optimization
  //
  const addPlugin = (flag, plugin) => { if (flag === true) { config.plugins.push(plugin); }};
  addPlugin(isProduction, new webpack.optimize.UglifyJsPlugin({ minimize: true }));
  addPlugin(isProduction, new webpack.optimize.OccurrenceOrderPlugin(true));

  // Finish up.
  return config;
};

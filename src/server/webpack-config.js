import webpack from 'webpack';
import fsPath from 'path';
import { rootModulePath } from './paths';

const NODE_MODULES_PATH = fsPath.join(rootModulePath(), 'node_modules');


const babelLoader = (extension) => ({
  // See: https://github.com/babel/babel-loader#options
  loader: 'babel',
  test: extension,
  exclude: /(node_modules|bower_components)/,
  query: {
    // plugins: ['./build/babelRelayPlugin'],
  },
});



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
    output: { path: '/', filename: 'bundle.js' },
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
      // https://github.com/webpack/docs/wiki/optimization#deduplication
      new webpack.optimize.DedupePlugin(),

      // [Moment.js] only load subset of locales to reduce size.
      //   See - http://stackoverflow.com/a/25426019/1745661
      new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/),
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

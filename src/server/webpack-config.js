import webpack from 'webpack';
import fsPath from 'path';
import { rootModulePath } from './paths';

const NODE_MODULES_PATH = fsPath.join(rootModulePath(), 'node_modules');
const UIHARNESS_ENTRY = fsPath.join(__dirname, '../client/ui-harness');



// HACK (Relay).
//       Prevent error with `fetch` which attempts to look for a `self` object.
//       This occurs when parsing the `react-relay` module on the server while compiling.
global.self = { fetch: null };



const productionEnvPlugin = new webpack.DefinePlugin({
  'process.env': {
    NODE_ENV: JSON.stringify('production'),
  },
});


const babelLoader = (extension, isRelayEnabled) => {
  const loader = {
    // See: https://github.com/babel/babel-loader#options
    loader: 'babel',
    test: extension,
    exclude: /(node_modules|bower_components)/,
    query: {
      plugins: [],
    },
  };

  // Add optional plugins.
  if (isRelayEnabled) {
    loader.query.plugins.push(fsPath.join(__dirname, '../relay/babel-relay-plugin'));
  }

  // Finish up.
  return loader;
};



/**
 * Creates a Webpack compiler instance.
 *
 * @param {Object} options:
 *            -- entry:           Array of entry paths.
 *            -- isProduction:    Flag indicating if the builder is in production mode.
 *                                Default: false.
 *
 *            -- outputFile:      The name of the output file.
 *                                Default: 'bundle.js'.
 *
 *            -- isRelayEnabled:  Flag indicating if relay is being used.
 *                                Default: false.
 *
 *            -- vendor:          An array of vendor modules or entry paths.
 *                                Pass empty-array for no vendor modules
 *                                otherwise the default set of vendors is included.
 *
 *            -- cssModules:      An array of regular expressions.
 *                                Default: undefined.
 *
 * @return {Object} compiler.
 */
export default (options = {}) => {
  const isProduction = options.isProduction || false;
  const outputFile = options.outputFile || 'bundle.js';
  const isRelayEnabled = options.isRelayEnabled || false;

  let vendor = options.vendor;
  if (vendor === undefined) {
    vendor = ['react', 'react-dom', 'react-relay', UIHARNESS_ENTRY];
  }

  const config = {
    entry: {
      app: options.entry,
      vendor,
    },
    output: { path: '/', filename: outputFile },
    module: {
      loaders: [
        babelLoader(/\.js$/, isRelayEnabled),
        babelLoader(/\.jsx$/, isRelayEnabled),
        { test: /\.json$/, loader: 'json' },
        { test: /\.(png|svg)$/, loader: 'url' },
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
      new webpack.optimize.DedupePlugin(),

      // [Moment.js] only load subset of locales to reduce size.
      //    See - http://stackoverflow.com/a/25426019/1745661
      new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/),

      // Break out common libs into their own code-chunk.
      //    See - https://webpack.github.io/docs/code-splitting.html#split-app-and-vendor-code
      new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', path: '/', filename: 'vendor.js' }),
    ],
  };

  // Configure CSS loaders
  const { loaders } = config.module;
  const { cssModules } = options;
  const simpleCssLoader = { test: /\.css$/, loader: 'style!css' };
  if (cssModules) {
    let simpleLoaderAdded = false;
    cssModules.forEach(test => {
      loaders.push({
        test,
        loader: 'style!css?modules',

        // Loader syntax below from:
        //    https://github.com/css-modules/webpack-demo
        // loader: 'style!css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
      });
      if (test.toString() === simpleCssLoader.test.toString()) {
        simpleLoaderAdded = true;
      }
    });
    // Add the simple CSS loader if the extension was not included for css-module's.
    if (!simpleLoaderAdded) {
      loaders.push(simpleCssLoader);
    }
  } else {
    // Add simple CSS loader (default).
    loaders.push(simpleCssLoader);
  }

  // Configure optional plugins.
  //    See - https://webpack.github.io/docs/list-of-plugins.html
  //        - https://github.com/webpack/docs/wiki/optimization
  //
  const addPlugin = (flag, plugin) => { if (flag === true) { config.plugins.push(plugin); }};
  addPlugin(isProduction, new webpack.optimize.UglifyJsPlugin({ minimize: true }));
  addPlugin(isProduction, new webpack.optimize.OccurrenceOrderPlugin(true));
  addPlugin(isProduction, productionEnvPlugin);

  // Finish up.
  return config;
};

import webpack from 'webpack';
import fsPath from 'path';
import { rootModulePath, REACT_PATH } from './paths';

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
    loaders: ['babel'],
    test: extension,
    exclude: /(node_modules|bower_components)/,
  };

  // Add optional plugins.
  if (isRelayEnabled) {
    loader.loaders[0] += `?plugins[]=${ fsPath.join(__dirname, '../relay/babel-relay-plugin') }`;
  }

  // Finish up.
  return loader;
};

const typescriptLoader = (extension, isRelayEnabled) => {
  // Extend existing config
  const loader = babelLoader(extension, isRelayEnabled);

  // Add typescript loader
  loader.loaders.push('awesome-typescript-loader');

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

  if (!REACT_PATH) {
    throw new Error('The path to the `react` module was not found. Make sure it is installed');
  }

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
        typescriptLoader(/\.tsx?$/, isRelayEnabled),
        { test: /\.json$/, loader: 'json' },
        { test: /\.(png|svg)$/, loader: 'url-loader' },
      ],
    },
    devtool: isProduction ? undefined : 'cheap-module-eval-source-map',
    resolve: {
      moduleDirectories: NODE_MODULES_PATH,
      extensions: [''].concat(
        options.extensions || 
        ['.web.tsx', '.web.ts', 'web.js', '.js', '.jsx', '.json', '.ts', '.tsx']
      ),
      resolveLoader: { fallback: NODE_MODULES_PATH },
      alias: {
        react: REACT_PATH, // Lock the bundled version of React to that of the UIHarness.
      },
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
        loader: 'style!css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]', // eslint-disable-line max-len
        exclude: /node_modules/,

        // Loader syntax below from:
        //    https://github.com/css-modules/webpack-demo
      });
      if (test.toString() === simpleCssLoader.test.toString()) {
        simpleLoaderAdded = true;
      }
    });


    // Add the simple CSS loader if the extension was not included for css-module's.
    if (!simpleLoaderAdded) {

      /*
      We need to exclude all paths meant for css modules from the standard css parser, otherwise
      webpack will run the module code through both matches, which results in the JS being parsed
      as CSS. Eek!

      To do this, we need to "exclude" all the css modules regexes from the standard css regex. We
      can do this using negative lookups.

      General regex form: /^((?![css_sources joined with |]).)*.[standard_css_source]$/
      Explanation:
      ^ -   need to assert start of string otherwise our negative lookup won't work
      ?! -  negative lookup - don't match what's in this matching group (i.e. parenthesis)
      [css_sources] -   the regexes *not* to match
      | -   a way to join sources as to not match *any* of them
      . -   match any other character, i.e. normal file names with dashes etc.
      * -   match this "non-matching" group as many times as necessary
      [standard_css_source] - our existing css file path
      $ -   need to match end of string for same reason as above

      Refs
      ----
      https://github.com/css-modules/css-modules/pull/65
      http://stackoverflow.com/questions/2078915/a-regular-expression-to-exclude-a-word-stringify
      https://regex101.com/r/gL5lR9/1 (regex tester made to test this code)
      */

      // We need to extract the regex part inside the // markers - i.e. don't use the string
      // representation
      const sources = cssModules.map(test => test.source);
      const simpleRegexWithoutModule = new RegExp(
        `^((?!${ sources.join('|') }).)*${ simpleCssLoader.test.source }`
      );

      // Push the new loader onto the list of loaders, but with a different test.
      loaders.push({
        ...simpleCssLoader,
        test: simpleRegexWithoutModule,
      });
    }
  } else {
    // Add simple CSS loader (default).
    loaders.push(simpleCssLoader);
  }

  // Configure optional plugins.
  //    See - https://webpack.github.io/docs/list-of-plugins.html
  //        - https://github.com/webpack/docs/wiki/optimization
  //
  const addPlugin = (flag, plugin) => { if (flag === true) { config.plugins.push(plugin); } };
  addPlugin(isProduction, new webpack.optimize.UglifyJsPlugin({ minimize: true }));
  addPlugin(isProduction, new webpack.optimize.OccurrenceOrderPlugin(true));
  addPlugin(isProduction, productionEnvPlugin);

  // Finish up.
  return config;
};

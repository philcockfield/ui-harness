/*
See:

    https://github.com/webpack/webpack-dev-middleware
    https://www.npmjs.com/package/webpack-hot-middleware

    https://github.com/kriasoft/react-starter-kit/blob/master/webpack.config.js

*/
import webpack from 'webpack';
import fsPath from 'path';

export const PORT = 8080;
const NODE_MODULES_PATH = fsPath.join(__dirname, '../../node_modules');
var modulePath = (path) => fsPath.join(NODE_MODULES_PATH, path);


export var compiler = {
  entry: [
    'webpack/hot/dev-server',
    'webpack-hot-middleware/client',
    fsPath.join(__dirname, '../client/components/index.js')
  ],
  output: {
    filename: 'bundle.js',
    path: '/',
    publicPath: `http://localhost:${ PORT }/public`
  },

  plugins: [
    // Hot reload plugins:
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],

  resolve: {
    fallback: NODE_MODULES_PATH,
    extensions: ['', '.js', '.jsx'],

    /*
    Aliases
    Ensure common libraries are:
      - Module code loaded only once (de-duped)
      - Single version of modules are loaded.
    */
    alias: {
      'react': modulePath('react'),
      'lodash': modulePath('lodash'),
      'immutable': modulePath('immutable'),
      'bluebird': modulePath('bluebird')
    }
  },
  resolveLoader: { fallback: NODE_MODULES_PATH },

  module: {
    loaders: [
      // ES6/JSX.
      { test: /\.js$/, exclude: /(node_modules|bower_components)/, loader: 'babel-loader' },
      { test: /\.jsx$/, exclude: /(node_modules|bower_components)/, loader: 'babel-loader' }
    ]
  }
};


export var options = {
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

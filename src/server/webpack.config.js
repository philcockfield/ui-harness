/*
See:

    https://github.com/webpack/webpack-dev-middleware
    https://www.npmjs.com/package/webpack-hot-middleware

*/
import webpack from 'webpack';
import fsPath from 'path';

export const PORT = 8080;
const NODE_MODULES_PATH = fsPath.join(__dirname, '../../node_modules');


export var compiler = {
  entry: [
    'webpack/hot/dev-server',
    'webpack-hot-middleware/client',
    fsPath.join(__dirname, '../components/index.js')
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

  resolve: { fallback : NODE_MODULES_PATH },
  resolveLoader: { fallback: NODE_MODULES_PATH },

  module: {
    loaders: [
      // ES2015 (ES6).
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'}
    ]
  }
};


export var options = {
    noInfo: false,
    quiet: false,
    lazy: false,
    watchOptions: {
        aggregateTimeout: 300,
        poll: true
    },
    publicPath: compiler.output.publicPath,
    stats: { colors: true }
};

import WebpackDevServer from 'webpack-dev-server';
import webpack from 'webpack';



/**
 * Creates a new WebpackDevServer.
 *
 * @param {Object} config: The Webpack configuration object.
 *
 * @param {Object} options:
 *                   -- proxy:  Optional. An object containing { path, host }
 *                              mappings to proxy server requests to.
 *                              (https://webpack.github.io/docs/webpack-dev-server.html#proxy)
 *
 * @return The dev-server instance.
 */
export default (config, options = {}) => {
  const compiler = webpack(config);
  const settings = {
    noInfo: true, // Lower the noise in the console.
    contentBase: '/public/',
    proxy: options.proxy,
    publicPath: '/js/',
    stats: {
      assets: false,
      colors: true,
      version: false,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false,
    },
  };

  // Finish up.
  return new WebpackDevServer(compiler, settings);
};

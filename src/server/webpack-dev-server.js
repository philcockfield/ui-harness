import WebpackDevServer from 'webpack-dev-server';
import webpack from 'webpack';



/**
 * Creates a new WebpackDevServer.
 *
 * @param {Object} config: The Webpack configuration object.
 *
 * @return The dev-server instance.
 */
export default (config) => {
  const compiler = webpack(config);
  const settings = {
    // hot: true,
    noInfo: true, // Suppress boring information.

    contentBase: '/public/',
    // proxy: {'/graphql': `http://localhost:${GRAPHQL_PORT}`},
    publicPath: '/js/',
    stats: { colors: true },
  };

  // Finish up.
  return new WebpackDevServer(compiler, settings);
};

/* global __dirname console */

import _ from 'lodash';
import chalk from 'chalk';
import express from 'express';
import webpack from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import immutable from 'immutable';
import Server from 'server-methods';
import * as config from './webpack.config';

const PORT = config.PORT;



/*
Starts the UIHarness within a development server.
@params options: Configuration options.

          - entry: A string or array of strings to entry points of files
                   to pass to WebPack to build for the client.

*/
export var start = (options = {}) => {
  var app = express();

  // Prepare configuration.
  var webpackOptions = immutable.fromJS(config.compiler).toJS();
  var entry = options.entry || [];
  if (!_.isArray(entry)) { entry = [entry]; }
  entry.forEach((path) => webpackOptions.entry.push(path));

  // Create the WebPack compiler and hot-reloading dev server.
  var compiler = webpack(webpackOptions);
  app.use(webpackMiddleware(compiler, config.options));
  app.use(webpackHotMiddleware(compiler));

  // Configure the server methods.
  Server.init(app);

  // TEMP
  Server.methods({

    'foo/method1': () => {},
    'foo/method2': () => {}

  });



  // Serve host HTML page from root.
  app.get('/', function (req, res) { res.sendFile(`${ __dirname }/index.html`); });




  // Start the server. -----------------------------------------------------------
  //
  app.listen(PORT, () => {
        const HR = chalk.cyan(_.repeat('-', 80));
        console.log(HR);
        console.log(chalk.grey('UIHarness running on'), chalk.cyan(`localhost:${ PORT }`));
        console.log(HR, '\n');
  });
};

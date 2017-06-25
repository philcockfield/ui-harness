'use strict'
var R = require('ramda');
var minimist = require('minimist');
var chalk = require('chalk');
var server = require('./lib/server').default;
var yamlConfig = require('./lib/server/yaml-config');
var log = require('./lib/shared/log').default;


// Read-in command-line arguments.
var args = process.argv.slice(2);
args = args.length > 0 ? args = minimist(args) : {};


// Start the build.
server.build()
  .catch(err => {
    log.error(chalk.red('Failed to build.'));
    log.error(chalk.grey(err.message));
    log.error();
  });

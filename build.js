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


(function() {
  // Look for build instructions.
  const config = yamlConfig.load();
  if (!config) {
    log.error();
    log.error(chalk.red('Cannot build because a `.uiharness.yml` file was not found.'));
    log.error();
    return;
  }
  const buildConfig = config && config.build;
  if (!R.is(Object, buildConfig)) {
    log.error();
    log.error(chalk.red('The `.uiharness.yml` file must have a build section.'));
    log.error();
    return;
  }

  // Start the build.
  server.build(buildConfig)
    .catch(err => {
      log.error(chalk.red('Failed to build.'));
      log.error(chalk.red(err.message));
      log.error();
    });

})();

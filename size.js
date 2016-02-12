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


// Look for an entry string.
const config = yamlConfig.load();
const entry = args.entry || (config && config.entry);



/**
 * Look for arguments passed in at the command-line,
 * and then calculate the size of the JS.
 *
 * If arguments are no explicitly passed at the command-line, then the values are
 * retrieved from the [.uiharness.yml] file if present.
 *
 * Command-line arguments:
 *
 *           --entry:  Required. Path to the specs files
 *                     (comma seperated if more than one).
 *                     If not present the server is not started.
 *                     Example: --entry ./src/specs
 *
 *           --prod:   Flag indicating if the JS should be built for production (smaller).
 *                     Default: false.
 *
 */
if (entry) {
  server.size({
    entry: entry.split(','),
    prod: args.prod,
    silent: false,
  })
  .catch(err => {
    log.error(chalk.red('Failed to calculate JS size.'));
    log.error(chalk.red(err.message));
    log.error();
  });

} else {
  log.error();
  log.error(chalk.red('No entry path was specified for the UIHarness.'));
  log.error(chalk.grey('  Make sure you have a [.uiharness.yml] file in the root of the project,'));
  log.error(chalk.grey('  or pass a --entry command line argument, for example: `--entry ./src/specs`'));
  log.error();
}

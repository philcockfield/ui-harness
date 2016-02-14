var R = require('ramda');
var minimist = require('minimist');
var chalk = require('chalk');
var fsPath = require('path');

var codeDir = process.env.QUICK_BUILD ? 'src' : 'lib';
var loadScript = path => require(fsPath.join(__dirname, codeDir, path));

var server = loadScript('server').default;
var yamlConfig = loadScript('server/yaml-config');
var log = loadScript('shared/log').default;


// Read-in command-line arguments.
var args = process.argv.slice(2);
args = args.length > 0 ? args = minimist(args) : {};


// Look for an entry string.
const config = yamlConfig.load() || {};
const entry = args.entry || (config && config.entry);


/**
 * Look for arguments passed in at the command-line,
 * and starts the server if required.
 *
 * If arguments are no explicitly passed at the command-line, then the values are
 * retrieved from the [.uiharness.yml] file if present.
 *
 * Command-line arguments:
 *
 *    --entry:          Required. Path to the specs files (comma separated if more than one).
 *                      If not present the server is not started.
 *                      Example: --entry ./src/specs
 *
 *    --port:           Optional. The port to start the server on.
 *                      Default: 3030
 *
 */
if (entry) {
  server.start({
    entry: entry.split(','),
    port: args.port || config.port,
  })
  .catch(err => {
    log.error(chalk.red('Failed to start.'));
    log.error(chalk.red(err.message));
    log.error()
  });
} else {
  log.error();
  log.error(chalk.red('No entry path was specified for the UIHarness.'));
  log.error(chalk.grey('  Make sure you have a [.uiharness.yml] file in the root of the project,'));
  log.error(chalk.grey('  or pass a --entry command line argument, for example: `--entry ./src/specs`'));
  log.error();
}

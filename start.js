"use strict"
var R = require("ramda");
var minimist = require("minimist");
var chalk = require("chalk");
var server = require("./lib/server");

var args = process.argv.slice(2);
args = args.length > 0 ? args = minimist(args) : null;


/**
 * Look for arguments passed in at the command-line,
 * and starts the server if required.
 *
 * Command-line arguments:
 *
 *           --entry: Required. Path to the specs files (comma seperated if more than one).
 *                    If not present the server is not started.
 *                    Example: --entry ./src/specs
 *
 *           --port:  Optional. The port to start the server on.
 *                    Default: 3030
 *
 */
if (args && R.is(String, args.entry)) {
  server.start({
    entry: args.entry.split(","),
    port: args.port
  });
} else {
  console.log(chalk.red("No entry path was specified, for example: `--entry ./src/specs`\n"));
}

"use strict"
var R = require("ramda");
var minimist = require("minimist");
var chalk = require("chalk");
var toBool = require("js-util").toBool;
var server = require("./lib/server");

var args = process.argv.slice(2);
args = args.length > 0 ? args = minimist(args) : null;


/**
 * Look for arguments passed in at the command-line,
 * and builds the javascript using Webpack.
 *
 * Command-line arguments:
 *
 *           --entry:   Required. Path(s) to the files to build.
 *                      Comma-seperated to include multiple paths.
 *                      Example: --entry ./src/specs
 *
 *           --output:  Optional. Path to save the output to.
 *
 *           --prod:    Optional. Flag indicating if the JS should be build in production mode
 *                      meaning optimizations (like minification) are employed.
 *                      Default: true
 *
 */
if (args && R.is(String, args.entry)) {
  server.bundle({
    entry: args.entry.split(","),
    output: args.output,
    isProduction: toBool(args.prod)
  });
} else {
  console.log(chalk.red("No entry path was specified, for example: `--entry ./src/specs`\n"));
}

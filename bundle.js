"use strict"
var R = require("ramda");
var fs = require("fs-extra");
var path = require("path");
var minimist = require("minimist");
var chalk = require("chalk");
var toBool = require("js-util").toBool;
var shell = require("shelljs");

// Ensure the 'lib' has been built.
if (!fs.existsSync(path.join(__dirname, "lib"))) {
  shell.exec("gulp build");
}
var server = require("./lib/server");


// Retrieve command-line arguments.
var args = process.argv.slice(2);
args = args.length > 0 ? args = minimist(args) : {};


// Set initialization paths if [--init] was passed.
if (args.init) {
  args.prod = true;
  args.entry = "./src/client/entry.js";
  args.output = "./public/js/ui-harness.js";
}


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
if (R.is(String, args.entry)) {
  server.bundle({
    entry: args.entry.split(","),
    output: args.output,
    isProduction: toBool(args.prod)
  });
} else {
  console.log(chalk.red("No entry path was specified, for example: `--entry ./src/specs`\n"));
}

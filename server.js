"use strict"
var R = require("ramda");
var minimist = require("minimist");
var middleware = require("./lib/server/middleware");



/**
 * Public API.
 */
module.exports = middleware;



/**
 * Look for arguments passed in at the command-line,
 * and start the server if required.
 *
 * Arguments:
 *           --entry: Required. Path to the specs files (comma seperated if more than one).
 *                    If not present the server is not started.
 *                    Example: --entry ./src/specs
 *
 *           --port:  Optional. The port to start the server on.
 *                    Default: 3030
 *
 *           --babel: Optional. The babel "stage" to transpile using.
 *                    See: https://babeljs.io/docs/usage/experimental/
 *                    Default: 1
 */
var argv = process.argv.slice(2);
if (argv.length > 0) {
  argv = minimist(argv);
  if (R.is(String, argv.entry)) {
    middleware.start({
      entry: argv.entry.split(","),
      port: argv.port || 3030,
      babel: argv.babel || 1
    });
  }
}

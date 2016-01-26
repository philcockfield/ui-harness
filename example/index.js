require('babel-register');
require('babel-polyfill');
var fsPath = require('path');
var minimist = require('minimist');
var updateSchema = require('../src/relay/update-schema').default;


// Read-in command line args.
var args = process.argv.slice(2);
args = args.length > 0 ? args = minimist(args) : { _:[] };


// Determine which example to start.
var example = args._[0] || 'relay';
switch (example) {
  case 'relay': require('./relay/server'); break;

  default:
    console.log(`Example '${ example }' not found.`);
}

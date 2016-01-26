/*
  The path to the [schema.json] file is passed in within a temporarily stored
  global variables.

  See: [./init-relay] for more details on this.
*/

const babelRelayPlugin = require('babel-relay-plugin');
const schema = require(global.__relayPluginSchemaJsonPath);
export default babelRelayPlugin(schema.data);

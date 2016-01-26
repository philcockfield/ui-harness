const getBabelRelayPlugin = require('babel-relay-plugin');

export default (schemaJsonPath) => {
  var schema = require(schemaJsonPath); // TEMP hard-coded path.
  return getBabelRelayPlugin(schema.data)
};

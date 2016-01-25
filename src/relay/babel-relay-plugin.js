
var getbabelRelayPlugin = require('babel-relay-plugin');
var schema = require('../../example/relay/data/schema.json'); // TEMP hard-coded path.

// console.log("schema", schema);
// console.log("getbabelRelayPlugin(schema.data)", getbabelRelayPlugin(schema.data));

console.log("plugin running");

module.exports = getbabelRelayPlugin(schema.data, { abortOnError: true });

// export default getbabelRelayPlugin(schema.data);

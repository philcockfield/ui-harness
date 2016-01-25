/*
  Based on: Source: https://github.com/relayjs/relay-starter-kit
*/
import express from 'express';
import fsPath from 'path';
import graphQLHTTP from 'express-graphql';
import { Schema } from './data/schema';
import * as uiharness from '../../src/server';

const GRAPHQL_PORT = 8080;
const UIHARNESS_PORT = 3030;

// Expose a GraphQL endpoint.
var graphQLServer = express();
graphQLServer.use('/', graphQLHTTP({
  graphiql: true,
  pretty: true,
  schema: Schema,
}));
graphQLServer.listen(GRAPHQL_PORT, () => {
  console.log(`GraphQL Server running on http://localhost:${ GRAPHQL_PORT }`);
});



// Start the UIHarness.
uiharness.start({
  entry: fsPath.resolve("./src/specs"),
  port: UIHARNESS_PORT
})

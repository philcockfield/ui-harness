/*
  Based on: Source: https://github.com/relayjs/relay-starter-kit
*/
import express from 'express';
import fsPath from 'path';
import graphQLHTTP from 'express-graphql';
import chalk from 'chalk';
import { Schema } from './data/schema';
import uiharness from '../../lib/server';
import log from '../../lib/shared/log';

const GRAPHQL_PORT = 8080;
const UIHARNESS_PORT = 3030;


// Configure the GraphQL server.
var graphQLServer = express();
graphQLServer.use('/', graphQLHTTP({
  graphiql: true,
  pretty: true,
  schema: Schema,
}));


// Start the GraphQL server.
graphQLServer.listen(GRAPHQL_PORT, () => {
  log.info();
  log.info(`${ chalk.magenta('GraphQL Server') } running on http://localhost:${ GRAPHQL_PORT }`);

  // Start the UIHarness.
  uiharness.start({
    entry: './example/relay/specs',
    port: UIHARNESS_PORT,
    proxy: { '/graphql': `http://localhost:${ GRAPHQL_PORT }` },
    graphqlSchema: fsPath.resolve('./example/relay/data/schema.js')
  })
  .catch(err => {
    log.error(chalk.red(`Error while starting UIHarness:`));
    log.error(chalk.red(err.message))
    console.error();
  });
});

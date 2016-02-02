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

const GRAPHQL_PORT = 4000;
const UIHARNESS_PORT = 3030;


// Configure the GraphQL server.
var graphqlServer = express();

graphqlServer.use('/', graphQLHTTP({
  graphiql: true,
  pretty: true,
  schema: Schema,
}));


const startClient = () => {
  // Start the UIHarness.
  // The parameters could also be specified within a [.uiharness.yml] configuration file.
  uiharness.start({
    entry: './example/relay/specs',
    port: UIHARNESS_PORT,
    proxy: { '/graphql': `http://localhost:${ GRAPHQL_PORT }` },
    graphqlSchema: './example/relay/data/schema.js' // Could also be the '.json' file.
  })
  .catch(err => {
    log.error(chalk.red(`Error while starting UIHarness:`));
    log.error(chalk.red(err.message))
    console.error();
  });
};


const startServer = (callback) => {
  graphqlServer.listen(GRAPHQL_PORT, () => {
    log.info();
    log.info(`${ chalk.magenta('GraphQL Server') } running on http://localhost:${ GRAPHQL_PORT }`);
    if (callback) { callback(); }
  });
};


// startClient();
// startServer();
startServer(() => startClient());

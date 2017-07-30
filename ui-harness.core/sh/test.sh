#!/bin/bash
export NODE_ENV=test
export TS_NODE_FAST=true

./node_modules/mocha/bin/mocha $@ \
  --require ts-node/register \
  --watch-extensions ts,tsx \
  'src/**/*.test.ts{,x}'

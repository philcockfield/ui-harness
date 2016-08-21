import server from './server/index.js';
import bdd from 'js-bdd';

// Server API - Maintain backwards compatibility
export default {
  start: server.start,
  build: server.build,
};

export const before = bdd.before;
export const describe = bdd.describe;
export const it = bdd.it;
export const section = bdd.section;


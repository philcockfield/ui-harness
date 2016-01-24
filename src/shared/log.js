/* eslint no-use-before-define:0 no-console:0 */

const log = (items) => {
  if (!api.silent) { console.log(items.join(' ')); }
};


/**
 * Stub log shim.
 * Pipe these log items into a proper service log.
 */
const api = {
  silent: false,
  info(...items) { log(items); },
  warn(...items) { log(items); },
  error(...items) { log(items); },
};



export default api;

/* eslint no-use-before-define:0 no-console:0 */

const log = (items, method) => {
  if (!api.silent) { console[method](items.join(' ')); }
};



/**
 * Stub log shim.
 * Pipe these log items into a proper service log.
 */
const api = {
  silent: false,
  info(...items) { log(items, 'info'); },
  warn(...items) { log(items, 'warn'); },
  error(...items) { log(items, 'error'); },
};



export default api;

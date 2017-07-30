/**
 * NB: Pipe these log items into a proper service log.
 */
export const log = {
  silent: false,
  info(...items: any[]) { write(items); },
  warn(...items: any[]) { write(items); },
  error(...items: any[]) { write(items); },
  DEBUG(...items: any[]) { write(items); },
};
export default log;



const write = (items: any[]) => {
  if (global.console && !log.silent) {
    console.log.apply(console, items); /* tslint:disable:no-console */
  }
};

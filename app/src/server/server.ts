import next = require('next');
import { RequestHandler } from 'express';
import { bodyParser, express, log, fsPath, constants } from './common';
const argv = require('minimist')(process.argv.slice(2));



export { express };
export interface IServerOptions {
  // dir?: string;
  static?: string;
  dev?: boolean; // Command-line: --dev
  port?: number; // Command-line: --port
  silent?: boolean;
}



const optionValue = <T>(key: string, defaultValue: T, options: IServerOptions): T => {
  if (options && options[key] !== undefined) { return options[key]; }
  if (argv[key] !== undefined) { return argv[key]; }
  return defaultValue;
};



/**
 * Starts the server.
 */
export function init(options: IServerOptions = {}) {
  // Setup initial conditions.
  const dev = optionValue<boolean>('dev', constants.IS_DEV, options);
  const port = optionValue<number>('port', 3000, options);
  const silent = optionValue<boolean>('silent', false, options);
  const staticPath = optionValue<string>('static', './static', options);
  const dir = fsPath.join(constants.MODULE_PATH, 'lib');
  const config = {
    dir,
    static: staticPath,
    dev,
    port,
    argv,
  };

  // Configure the express server.
  const server = express()
    .use(bodyParser.json({}))
    .use(express.static(fsPath.resolve(staticPath)));

  // Configure the Next.js server.
  const app = next({
    dev,
    dir,
  });
  const handle = app.getRequestHandler();

  const logStarted = () => {
    if (silent) { return; }
    // const PACKAGE = require(fsPath.resolve('./package.json'));
    log.info(`> ✨✨  Ready on ${log.cyan('localhost')}:${log.magenta(port)}`);
    log.info();
    // log.info.gray(`  - name:    ${PACKAGE.name}@${PACKAGE.version}`);
    log.info.gray(`  - static:  ${config.static}`);
    log.info.gray(`  - dev:     ${dev}`);
    log.info();
  };

  const listen = (server: express.Express) => {
    return new Promise((resolve, reject) => {
      server.listen(port, (err: Error) => {
        if (err) {
          reject(err);
        } else {
          logStarted();
          resolve();
        }
      });
    });
  };

  const restHandler = (verb: string) => {
    return (url: string, handler: RequestHandler) => {
      server[verb](url, handler);
      return result;
    };
  };

  const result = {
    get: restHandler('get'),
    put: restHandler('put'),
    post: restHandler('post'),
    delete: restHandler('delete'),

    start: async (port: number = 3000) => {
      server.get('*', (req, res) => handle(req, res));
      await app.prepare();
      await listen(server);
    },
  };

  return result;
}

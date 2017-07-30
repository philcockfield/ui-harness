import next = require('next');
import { parse as parseUrl } from 'url';
import { RequestHandler } from 'express';
import { bodyParser, express, log, fsPath, constants } from './common';
import '../generated/specs.g';


const argv = require('minimist')(process.argv.slice(2));
const SUITES = constants.SUITES;


export { express };
export interface IServerOptions {
  static?: string;
  dev?: boolean; // Command-line: --dev
  port?: number; // Command-line: --port
  silent?: boolean;
}

export type RegisterHandler = (url: string, handler: RequestHandler) => IServer;
export interface IServer {
  get: RegisterHandler;
  put: RegisterHandler;
  post: RegisterHandler;
  delete: RegisterHandler;
  start: (port?: number) => Promise<void>;
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
  const dir = fsPath.join(constants.UIHARNESS_MODULE_DIR, 'lib');

  // Configure the express server.
  const server = express()
    .use(bodyParser.json({}))
    .use('/@uiharness', express.static(fsPath.join(constants.UIHARNESS_MODULE_DIR, 'static')))
    .use(express.static(fsPath.resolve(staticPath)));

  // Configure the [Next.js] server.
  const nextApp = next({
    dev,
    dir,
  });
  const handle = nextApp.getRequestHandler();


  const findRoute = (pathname?: string) => {
    if (!pathname) { return; }
    return Object
      .keys(SUITES)
      .map((key) => SUITES[key])
      .find((suite) => suite.route === pathname);
  };

  server.get('*', async (req, res) => {
    const url = parseUrl(req.url, true);
    const { pathname, query } = url;

    const suite = findRoute(pathname);
    if (suite) {
      const path = '/foo';
      nextApp.render(req, res, path, query);
    } else {
      handle(req, res);
    }
  });

  const logStarted = () => {
    if (silent) { return; }
    const PACKAGE = require(fsPath.resolve('./package.json'));
    log.info(`> ✨✨  Ready on ${log.cyan('localhost')}:${log.magenta(port)}`);
    log.info();
    const detail = (msg: string, active: any = true) => active && log.info.gray(msg);
    detail(`  - name:    ${PACKAGE.name}@${PACKAGE.version}`);
    detail(`  - static:  ${staticPath}`, staticPath);
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

  const result: IServer = {
    get: restHandler('get'),
    put: restHandler('put'),
    post: restHandler('post'),
    delete: restHandler('delete'),

    start: async (port: number = 3000) => {
      server.get('*', (req, res) => handle(req, res));
      await nextApp.prepare();
      await listen(server);
    },
  };

  return result;
}

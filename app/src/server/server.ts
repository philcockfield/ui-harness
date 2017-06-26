import { express, constants, log, fsPath } from './common';
import * as next from 'next';

const PORT = 3000;

const dir = fsPath.resolve('./lib');
const dev = constants.IS_DEV;
const app = next({ dev, dir });
const handle = app.getRequestHandler();


app
  .prepare()
  .then(() => {
    // Setup express server and middleware.
    const server = express()
      .use(express.static(fsPath.resolve('./static')));

    // Handle routes.
    // const get = (fromUrl: string, toPage: string) => {
    //   server.get(fromUrl, (req, res) => app.render(req, res, toPage, req.params));
    // };

    // Routes.
    server.get('*', (req, res) => handle(req, res));

    // Start the server.
    server.listen(PORT, (err: Error) => {
      if (err) { throw err; }
      const env = dev ? 'dev' : 'prod';
      log.info.gray(`\n${log.magenta('Running on')} ${log.cyan(PORT)} (${env})`);
    });
  });


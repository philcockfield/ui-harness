import { fsPath, constants, log } from './common';
import { init, IServer } from './server';
import * as install from './install';



export interface IUIHarness {
  static?: string;
  port?: number;
  specs?: string;
}


export async function start(options: IUIHarness = {}) {
  log.info.gray('Starting...');

  // Ensure the module is in a place it can execute from.
  log.info.yellow('!!!!! TODO/DEV do not force ---');
  await install.copyModule({ force: false });

  // Load specs.
  await install.writeSpecs(options.specs || './lib/**/*spec.js');

  // Import the copied `ui-harness` module.
  const uiharness = require(fsPath.join(
    constants.BUILD_DIR,
    'ui-harness/lib/server/server',
  ));

  // Start the server.
  const server: IServer = uiharness.init({
    static: options.static,
    port: options.port,
  });


  server.start();
}

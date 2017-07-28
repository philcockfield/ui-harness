import { fsPath, log } from './server/common';
import { init } from './server/server';
import * as install from './server/install';


export interface IUIHarness {
  static?: string;
  port?: number;
}


export async function start(options: IUIHarness = {}) {
  log.info.gray('Starting...');

  // Ensure the module is setup.
  await install.init();

  // Import the module.
  const MODULE_PATH = fsPath.resolve('./.build/ui-harness/lib/server/server');
  const uiharness = require(MODULE_PATH);

  // Start the server.
  return uiharness.init({
    static: options.static,
    port: options.port,
  }).start();
}

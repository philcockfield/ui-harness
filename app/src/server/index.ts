import { fsPath, log } from './common';
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
  console.log('!!!!! TODO/DEV do not force ---');
  await install.copyModule({ force: false });

  // Load specs.
  await install.writeSpecs(options.specs || './lib/**/*spec.js');

  // Import the module.
  const MODULE_PATH = fsPath.resolve('./.build/ui-harness/lib/server/server');
  const uiharness = require(MODULE_PATH);

  // Start the server.
  const result: IServer = uiharness.init({
    static: options.static,
    port: options.port,
  });
  // .start();

  // console.log('result', result);

  result.start();
  // setTimeout(() => {
  //   result.start();
  // }, 100);


  // return result;
}

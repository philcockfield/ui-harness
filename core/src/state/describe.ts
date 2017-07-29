import { constants } from '../common';
import { ISuite } from '../types';

export interface ISuiteOptions {
  route?: string;
}



export function describe(name: string, options: ISuiteOptions = {}) {

  const suite: ISuite = {
    name,
    route: options.route,
  };
  console.log('-|| describe: ', suite);

  constants.SUITES[name] = suite;
}

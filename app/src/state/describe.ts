import { constants } from '../common';
export const specs = {};


export function describe(name: string) {
  console.log('------', name);
  constants.SPECS[name] = name;

  if (constants.IS_BROWSER) {
    constants.GLOBAL.FOO = constants.GLOBAL.FOO || {};
    constants.GLOBAL.FOO[name] = name;
  }

  specs[name] = name;
}

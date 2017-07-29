import { constants } from '../common';


export function describe(name: string) {
  console.log('------ describe: ', name);
  constants.SPECS[name] = name;
}

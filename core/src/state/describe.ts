import { constants, hash } from '../common';
import {
  ISuite,
  ISuites,
  IDescribe,
  IDescribeOptions,
  ISpec,
  ISpecOptions,
  SpecFunction,
} from '../types';


export const incrementUpdateVersion = () => {
  constants.GLOBAL_STATE.UPDATE_ID += 1;
  return constants.GLOBAL_STATE.UPDATE_ID;
};


export function describe(name: string, options: IDescribeOptions = {}) {
  const { SUITES, PLACEHOLDER } = constants;

  const suite: ISuite = {
    id: PLACEHOLDER,
    modulePath: PLACEHOLDER,
    update: constants.GLOBAL_STATE.UPDATE_ID,
    name,
    route: options.route,
    specs: [],
  };


  const add = (name: string, func: SpecFunction): IDescribe => {
    const spec: ISpec = {
      name,
      func,
    };
    suite.specs.push(spec);
    return api;
  };

  const api: IDescribe = {
    suite,
    add,
  };

  console.log('-|| describe: ', suite);

  // Store in global state.
  SUITES[name] = suite;
  return api;
}



/**
 * Processes `specs` a module upon being imported.
 */
export function moduleLoaded(modulePath: string) {
  const { SUITES, PLACEHOLDER } = constants;
  const allSuites = () => Object.keys(SUITES).map((key) => SUITES[key]);


  // Add the module-path (id) to new modules that don't have it yet.
  // This captures each module as it's loaded.
  allSuites()
    .filter((suite) => suite.modulePath === PLACEHOLDER)
    .forEach((suite) => suite.modulePath = modulePath);


  // Filter on the current set of suites.
  const currentSuites = () => allSuites()
    .filter((suite) => suite.modulePath === modulePath);

  // Add the unique-ID of the suite if it doesn't yet have one.
  currentSuites()
    .filter((suite) => suite.id === PLACEHOLDER)
    .forEach((suite) => {
      suite.id = `${hash(modulePath)}:${hash(suite.name)}`;
      delete SUITES[suite.name];
      SUITES[suite.id] = suite;
    });

  // Prune updated modules.
  // NB: This removes obsolete suites that have been renamed.
  const prune = (suites: ISuite[]) => {
    if (!hasUpdate(suites)) { return; }
    const latest = latestUpdate(suites);
    suites
      .forEach((suite) => {
        if (suite.update !== latest) {
          delete SUITES[suite.id];
        }
      });
  };
  prune(currentSuites());
}


const latestUpdate = (suites: ISuite[]) => updateRange(suites)[1];
const updateRange = (suites: ISuite[]) => {
  const updates = suites.map((suite) => suite.update);
  return [Math.min(...updates), Math.max(...updates)];
};
const hasUpdate = (suites: ISuite[]) => {
  const range = updateRange(suites);
  return range[0] !== range[1];
};


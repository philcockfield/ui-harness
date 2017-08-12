import { constants, hash, log } from '../common';
import {
  ISuite,
  ISuites,
  IDescribe,
  IDescribeOptions,
  ISpec,
  ISpecOptions,
  SpecFunction,
} from '../types';
import * as updateId from './update-id';





export function describe(name: string, options: IDescribeOptions = {}) {
  const { SUITES, PLACEHOLDER } = constants;

  const suite: ISuite = {
    id: PLACEHOLDER,
    modulePath: PLACEHOLDER,
    update: updateId.current(),
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

  log.info('-|| describe: ', suite.name);

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

  // Remove any outdated suites.
  pruneObsolete(currentSuites(), SUITES);
}



const pruneObsolete = (source: ISuite[], target: ISuites) => {
  if (!hasUpdate(source)) { return; }
  const latest = latestUpdate(source);
  source
    .forEach((suite) => {
      if (suite.update !== latest) {
        delete target[suite.id];
      }
    });
};




const latestUpdate = (suites: ISuite[]) => updateRange(suites)[1];
const updateRange = (suites: ISuite[]) => {
  const updates = suites.map((suite) => suite.update);
  return [Math.min(...updates), Math.max(...updates)];
};
const hasUpdate = (suites: ISuite[]) => {
  const range = updateRange(suites);
  return range[0] !== range[1];
};

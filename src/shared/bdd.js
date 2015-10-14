import _ from "lodash";
import bdd from "js-bdd";
import bddServer from "./bdd-server";
import ThisContext from "./ThisContext";

const ORIGINAL_DSL = {}

export default {
  supportedMethods: [
    "describe",
    "before",
    "it",
    "section"
  ],
  suites: bdd.allSuites,


  /**
   * Gets the set of [Suites] to show in the index.
   */
  rootSuites() {
    const getRoot = (suite) => {
        const parent = suite.parentSuite;
        return parent ? getRoot(parent) : suite;
    };
    let suites = bdd.suites();
    suites = _.filter(suites, suite => _.isUndefined(suite.parentSuite) || suite.isOnly);
    suites = suites.map(suite => getRoot(suite));
    suites = _.compact(_.unique(suites));
    return suites;
  },


  /**
   * Sets up the BDD domain specific language.
   * @param {object} namespace: The target object to register onto (ie. global||window).
   */
  register() {
    // Put the BDD domain-specific language into the global global.
    this.supportedMethods.forEach(name => {
          ORIGINAL_DSL[name] = global[name];
          global[name] = bdd[name];
        });

    // Create the special context API that is used as [this]
    // within [describe/it] blocks.
    bdd.contextFactory = (type) => { return new ThisContext(type); };
  },


  /**
   * Removes the DSL from the global namespace.
   * @param {object} namespace: The target object to register onto (ie. global||window).
   */
  unregister() {
    this.supportedMethods.forEach(name => {
          global[name] = ORIGINAL_DSL[name];
        });
  },


  /**
   * Resets the global namespace and the BDD data structure.
   */
  reset() {
    this.unregister();
    bdd.reset();
  },
};

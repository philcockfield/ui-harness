import _ from "lodash";
import React from "react";
import Immutable from "immutable";
import * as util from "js-util";
import bdd from "./bdd";



/**
 * The API used internally by the UIHarness components.
 */
class ApiInternal {
  constructor() {
    this.current = Immutable.Map();
  }


  /**
   * Resets the internal API.
   * Used for testing.
   */
  reset() {
    this.current = this.current.clear();
    this.clearLocalStorage();
  }


  /**
   * Initializes the UIHarness environment.
   * @param {Function} callback: Invoked when ready to initialize the DOM.
   */
  init(callback) {
    // Put the BDD domain-specific language into the global namespace.
    bdd.register();

    // Insert the <Shell> into the root.
    //    NB: Signal DOM ready after a delay to ensure that the [describe/it]
    //        have fully parsed before initial render. Avoids a redraw.
    util.delay(() => {
        // Ensure the last loaded suite is set as the current state.
        this.loadSuite(this.lastSelectedSuite(), { storeAsLastSuite:false });
        callback()
    });

    // Finish up.
    return this;
  }


  /**
   * Loads the current suite into the Harness.
   *
   * @param suite: The {Suite} to load.
   * @param options
   *          - storeAsLastSuite: Flag indicating if the suite should be stored
   *                              as the last invoked suite in localStorage.
   *                              Default: true.
   */
  loadSuite(suite, { storeAsLastSuite = true } = {}) {
    // Setup initial conditions.
    if (!suite) { return this; }
    if (this.current.get("suite") === suite) { return this; }

    // Only load the suite if it does not have children
    // ie. is not a container/folder suite.
    if (suite.childSuites.length === 0) {
      let current = suite.meta.thisContext.toValues();
      current.suite = suite;
      current.indexMode = this.indexMode();
      this.setCurrent(current);
      if (storeAsLastSuite) { this.lastSelectedSuite(suite); }
    }

    // Finish up.
    return this;
  }


  /**
   * Invokes the given spec.
   * @param spec: The [Spec] to invoke.
   */
  invokeSpec(spec) {
    // TODO:
    console.log("API invoke spec", spec);
  }

  /**
   * Gets or sets the last selected [Suite].
   */
  lastSelectedSuite(suite) {
    if (suite) { suite = suite.id; }
    const result = this.localStorage("lastSelectedSuite", suite);
    return bdd.suites[result];
  }


  /**
   * Gets or sets the display mode of the left-hand index.
   * @param {string} mode: tree|suite
   */
  indexMode(mode) {
    let result = this.localStorage("indexMode", mode, { default: "tree" });
    if (mode !== undefined) {
      // WRITE (store in current state).
      this.setCurrent({ indexMode:mode });
    }
    return result;
  }


  /**
   * Updates the current state with the given values.
   *     NOTE: These values are cumulatively added to the state.
   *           Use "reset" to clear the state.
   *
   * @param args:  An object containing they [key:values] to set
   *               or null to clear values.
   */
  setCurrent(args) {
    // Update the state object.
    if (args) {
      _.keys(args).forEach(key => { this.current = this.current.set(key, args[key]) });
    } else {
      this.current = this.current.clear();
    }

    // Apply to the <Shell>.
    if (this.shell) { this.shell.setState({ current:this.current }); }
    return this;
  };


  /**
   * Provides common access to localStorage.
   * @param key:         The unique identifier of the value (this is prefixed with the namespace).
   * @param value:       (optional). The value to set (pass null to remove).
   * @param options:
   *           default:  (optional). The default value to return if the session does not contain the value (ie. undefined).
   *
   * @return the read value.
   */
  localStorage(key, value, options) {
    return util.localStorage.prop(`ui-harness:${ key }`, value, options);
  }


  /**
   * Removes all ui-harness values stored in local-storage.
   */
  clearLocalStorage() {
    util.localStorage.keys().forEach(key => {
        if (_.startsWith(key, "ui-harness:")) {
          util.localStorage.prop(key, null); // Remove.
        }
      });
  }
}


// Singleton instance.
export default new ApiInternal();

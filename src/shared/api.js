import _ from "lodash";
import React from "react";
import Immutable from "immutable";
import * as util from "js-util";
import bdd from "./bdd";
import apiConsole from "./api-console";


/**
 * The API used internally by the UIHarness components.
 */
class Api {
  constructor() {
    this.current = Immutable.Map();
    this.loadInvokeCount = 0;
  }


  /**
   * Initializes the UIHarness environment.
   * @param {Function} callback: Invoked when ready to initialize the DOM.
   */
  init(callback) {
    // Put state into global namespace.
    bdd.register();
    global.UIHarness = apiConsole;

    // Insert the <Shell> into the root.
    //    NB: Signal DOM ready after a delay to ensure that the [describe/it]
    //        have fully parsed before initial render. Avoids a redraw.
    util.delay(() => {
        // Ensure the last loaded suite is set as the current state.
        const suite = this.lastSelectedSuite();
        if (suite) {
          this.loadSuite(this.lastSelectedSuite(), { storeAsLastSuite:false });
          this.invokeBeforeHandlers(suite);
        }
        callback()
    });

    // Finish up.
    return this;
  }



  /**
   * Resets the internal API.
   * @param {boolean} hard: Flag indicating if all state from local-storage
   *                        should be cleared away, or just current selection state.
   */
  reset({ hard = true } = {}) {
    if (hard) {
      this.clearLocalStorage();
    } else {
      this.clearLocalStorage("lastInvokedSpec:");
    }
    this.lastSelectedSuite(null)
    this.setCurrent(null);
    return this;
  }


  /**
   * Removes all ui-harness values stored in local-storage.
   */
  clearLocalStorage(startsWith = null) {
    util.localStorage.keys().forEach(key => {
        let match = "ui-harness:";
        if (startsWith) { match += startsWith; }
        if (_.startsWith(key, match)) {
          util.localStorage.prop(key, null); // Remove.
        }
      });
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
      // Clear the current state.
      this.setCurrent(null);

      // Prepare the new current state.
      let current = suite.meta.thisContext.toValues();
      current.suite = suite;
      current.indexMode = this.indexMode();
      current.isBeforeInvoked = false;
      this.setCurrent(current);
      if (storeAsLastSuite) { this.lastSelectedSuite(suite); }

      // If the last invoked spec on the suite contained a load
      let lastInvokedSpec = this.lastInvokedSpec(suite);
      if (lastInvokedSpec && lastInvokedSpec.spec && lastInvokedSpec.isLoader) {
        this.invokeSpec(lastInvokedSpec.spec);
      }
    }

    // Finish up.
    return this;
  }


  /**
   * Invokes the given spec.
   * @param spec: The [Spec] to invoke.
   * @param callback: Invoked upon completion.
   *                   Immediately if the spec is not asynchronous.
   */
  invokeSpec(spec, callback) {
    // Setup initial conditions.
    const suite = spec.parentSuite;
    const self = suite.meta.thisContext;
    this.invokeBeforeHandlers(suite)
    let loadInvokeCountBefore = this.loadInvokeCount;

    // Invoke the methods.
    spec.invoke(self, callback);

    // Store a reference to last-invoked spec.
    this.lastInvokedSpec(suite, {
      spec: spec,
      isLoader: (this.loadInvokeCount > loadInvokeCountBefore)
    });

    // Increment the current invoke count for the spec.
    let specInvokeCount = this.current.get("specInvokeCount") || {};
    let total = specInvokeCount[spec.id] || 0;
    specInvokeCount[spec.id] = total + 1;
    this.setCurrent({ specInvokeCount: specInvokeCount });

    // Finish up.
    return this;
  }


  /**
   * Invokes the [before] handlers for
   * the given suite if required.
   * @return {boolean}  - true if the handlers were invoked
   *                    - false if they have already been invoked.
   */
  invokeBeforeHandlers(suite) {
    if (this.current.get("isBeforeInvoked")) { return false; }
    const self = suite.meta.thisContext;
    suite.beforeHandlers.invoke(self);
    this.current = this.current.set("isBeforeInvoked", true);
    return true
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
   * Gets or sets the last spec for the given suite
   * that was invoked that had a `.load()` call within it.
   */
  lastInvokedSpec(suite, { spec, isLoader = false} = {}) {
    const KEY = `lastInvokedSpec:${ suite.id }`;
    let value;
    if (spec !== undefined) {
      // WRITE.
      value = { spec: spec.id, isLoader: isLoader }
      spec = spec.id;
    }

    // READ.
    let result = this.localStorage(KEY, value);
    if (result) {
      result.spec = _.find(suite.specs, spec => spec.id === result.spec);
    }
    return result
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

    // READ.
    result = result || "tree";
    if (result !== "tree" && this.current.get("suite") === undefined) {
      result = "tree"
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
}


// Singleton instance.
export default new Api();

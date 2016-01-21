import R from "ramda";
import Promise from "bluebird";
import React from "react";
import Immutable from "immutable";
import { delay } from "js-util";
import localStorage from "js-util/lib/local-storage";
import bdd from "./bdd";
import apiConsole from "./api-console";
import GettingStarted from "../components/docs/GettingStarted";

const LOG_LIST = Symbol("log-list");
const COMPONENT = Symbol("component");


/**
 * The API used internally by the UIHarness components.
 */
class Api {
  constructor() {
    this.current = Immutable.Map();
    this[LOG_LIST] = Immutable.List();
    this.loadInvokeCount = 0;
  }


  /**
   * Initializes the UIHarness environment.
   * @return {Promise}.
   */
  init() {
    return new Promise((resolve, reject) => {

        // Put state into global namespace.
        bdd.register();
        global.UIHarness = global.uih = apiConsole;

        // Ensure the last loaded suite is set as the current state.
        const suite = this.lastSelectedSuite();
        if (suite) {
          this.loadSuite(this.lastSelectedSuite(), { storeAsLastSuite:false });
        }

        // Show "getting started" if empty.
        if (Object.keys(bdd.suites).length === 0) {
          this.setCurrent({
            header: "## Getting Started",
            hr: true,
            scroll: "y",
            width: "100%"
          });
          this.loadComponent(GettingStarted)
        }

        // Done.
        resolve({});
    });
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
    this.lastSelectedSuite(null);
    this.setCurrent(null);
    this.component(null);
    return this;
  }


  /**
   * Removes all ui-harness values stored in local-storage.
   */
  clearLocalStorage(startsWith = null) {
    localStorage.keys().forEach(key => {
        let match = "ui-harness:";
        if (startsWith) { match += startsWith; }
        if (key.startsWith(match)) {
          localStorage.prop(key, null); // Remove.
        }
      });
  }


  /**
   * Gets or sets the current component instance.
   * Pass {null} to clear.
   */
  component(value) {
    // WRITE.
    if (value !== undefined) {
      if (value === null) {
        // Unload component.
        delete this[COMPONENT];
        delete apiConsole.component;
        this.setCurrent({
          componentType: undefined,
          componentProps: undefined,
          componentChildren: undefined,
          component: undefined
        });

      } else {

        // Store component instance.
        this[COMPONENT] = value;
        apiConsole.component = value;
        if (this.current.get("component") !== value) {
          // NB: Preform instance comparison before updating the
          //     current state to prevent render loop.
          this.setCurrent({ component: value });
        }
      }
    }

    // READ.
    return this[COMPONENT];
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

      // Invoke before handlers.
      this.invokeBeforeHandlers(suite);

      // If the last invoked spec on the suite contained a load.
      let lastInvokedSpec = this.lastInvokedSpec(suite);
      if (lastInvokedSpec && lastInvokedSpec.spec && lastInvokedSpec.isLoader) {
        this.invokeSpec(lastInvokedSpec.spec);
      }
    }

    // Finish up.
    return this;
  }


  /**
   * Loads the given component.
   *
   * @param component:  The component Type
   *                    or created component element (eg: <MyComponent/>).
   * @param props:      Optional. The component props (if not passed in with a component element).
   * @param children:   Optional. The component children (if not passed in with a component element).
   */
  loadComponent(component, props, children) {
    // Setup initial conditions.
    if (!component) { throw new Error("Componnet not specified."); }

    // If a created <element> was passed de-construct
    // it into it's component parts.
    let type;
    if (React.isValidElement(component)) {
      props = R.clone(component.props);
      children = props.children;
      delete props.children;
      type = component.type;

    } else {
      type = component;
    }

    // Store on the current state.
    this.setCurrent({
      componentType: type,
      componentProps: props,
      componentChildren: children,
      showLog: false
    });

    // Finish up.
    this.loadInvokeCount += 1;
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
      result.spec = R.find(spec => spec.id === result.spec, suite.specs);
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
      Object.keys(args).forEach(key => {
        const value = args[key];
        this.current = value === undefined
                ? this.current.remove(key)
                : this.current.set(key, args[key])
      });
    } else {
      this.current = this.current.clear();
    }

    // Apply to the <Shell>.
    if (this.shell) { this.shell.setState({ current: this.current }); }
    return this;
  };


  /**
   * Logs a value to the output.
   * @param {array} values: The value or values to append.
   */
  log(...values) {
    values = R.flatten(values);
    const item = { time: new Date(), values };
    this[LOG_LIST] = this[LOG_LIST].push(item);
    this.setCurrent({ log: this[LOG_LIST], showLog: true });
    return this;
  }


  /**
   * Clears the output log.
   */
  clearLog() {
    // console.log("clear log");
    this[LOG_LIST] = this[LOG_LIST].clear();
    this.setCurrent({ log: this[LOG_LIST], showLog: false });

  }


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
    return localStorage.prop(`ui-harness:${ key }`, value, options);
  }
}


// Singleton instance.
export default new Api();

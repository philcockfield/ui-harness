import React from "react";
import Shell from "./components/Shell";
import Immutable from "immutable";
import * as util from "js-util";
import bdd from "../shared/bdd";


/**
 * The API used internally by the UIHarness components.
 */
class ApiInternal {
  constructor() {
    this.current = Immutable.Map();
  }


  /**
   * Renders the root <Shell> into the given elemnt.
   * @param {DOMElement} el: The element to render within.
   * @return the component instance.
   */
  init(el) {
    // Put the BDD domain-specific language into the global namespace.
    bdd.register();

    // Insert the <Shell> into the root.
    //    NB: Inserted into DOM after delay to ensure that [describe/it]
    //        have fully parsed before initial render. Avoids a redraw.
    util.delay(() => {
        // Ensure the last loaded suite is set as the current state.
        this.loadSuite(this.lastSelectedSuite(), { storeAsLastSuite:false });
        const props = { current: this.current };
        this.shell = React.render(React.createElement(Shell, props), el);
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
    if (this.current.get('suite') === suite) { return this; }

    // Only load the suite if it does not have children
    // ie. is not a container/folder suite.
    if (suite.childSuites.length === 0) {
      this.setCurrent({ suite:suite });
      if (storeAsLastSuite) { this.lastSelectedSuite(suite); }
    }

    // Finish up.
    return this;
  }

  /**
   * Gets or sets the last selected [Suite].
   */
  lastSelectedSuite(suite) {
    if (suite) { suite = suite.id; }
    const result = this.localStorage('lastSelectedSuite', suite);
    return bdd.suites[result];
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
    return util.localStorage.prop(`uih-${ key }`, value, options);
  }
}


// Singleton instance.
export default new ApiInternal();

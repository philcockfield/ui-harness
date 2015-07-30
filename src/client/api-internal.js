import React from "react";
import Shell from "./components/Shell";
import Immutable from "immutable";
import util from "js-util";


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
    const props = { current: this.current };
    this.shell = React.render(React.createElement(Shell, props), el);
    return this;
  }


  /**
   * Loads the current suite into the Harness.
   *
   * @param suite: The {Suite} to load.
   * @param options
   *          - storeAsLastSuite: Flag indicating if the suite should be stored
   *                              as the last invoked suite in LocalStorage.
   *                              Default: true.
   */
  loadSuite(suite, options = {}) {
    console.log("loadSuite"); // TEMP
    return this;
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
}


// Singleton instance.
export default new ApiInternal();

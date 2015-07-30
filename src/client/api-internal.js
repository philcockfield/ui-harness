import React from "react";
import Shell from "./components/Shell";
import Immutable from "immutable";
import util from "js-util";

let shell;
let current = Immutable.Map();




/**
 * Renders the root <Shell> into the given elemnt.
 * @param {DOMElement} el: The element to render within.
 * @return the component instance.
 */
export const loadHarness = (el) => {
  shell = React.render(React.createElement(Shell, { current: current }), el);
  return shell;
};



/**
 * Loads the current suite into the Harness.
 *
 * @param suite: The {Suite} to load.
 * @param options
 *          - storeAsLastSuite: Flag indicating if the suite should be stored
 *                              as the last invoked suite in LocalStorage.
 *                              Default: true.
 */
export const loadSuite = (suite, options = {}) => {

  // console.log("loadSuite"); // TEMP
  // setCurrent({ foo:123 })
};




/**
 * Updates the current state with the given values.
 *     NOTE: These values are cumulatively added to the state.
 *           Use "reset" to clear the state.
 *
 * @param args:  An object containing they [key:values] to set
 *               or null to clear values.
 */
const setCurrent = (args) => {
  if (args) {
    _.keys(args).forEach(key => { current = current.set(key, args[key]) });
  } else {
    current = current.clear();
  }
  if (shell) { shell.setState({ current:current }); }
};

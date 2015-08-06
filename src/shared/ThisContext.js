import _ from "lodash";
import React from "react";
import api from "./api";
import * as util from "js-util";

const isBrowser = (typeof window !== 'undefined');
const PROP = Symbol("Prop");
const FIELD_KEYS = [
  // "title",
  // "subtitle",
  "props",
  "children"
];


/**
 * The [this] context that is passed into the [describe/it]
 * BDD methods.
 */
export default class UIHarness {
  constructor() {
    // Determine whether this is the currently loaded suite.
    const isCurrent = () => {
          const currentSuite = api.current.get("suite");
          return (currentSuite && currentSuite.id === this.suite.id);
        };

    // Read|Write helper for data-property methods.
    const propState = {};
    this[PROP] = (key, value, options = {}) => {
          // WRITE.
          if (!_.isUndefined(value)) {
            propState[key] = value;
            if (isCurrent()) { api.setCurrent({ [key]: value }); }
            return this; // When writing the [this] context is returned.
                         // This allows for chaining of write operations.
          }
          // READ.
          let result = propState[key];
          if (_.isUndefined(result)) { result = options.default; }
          return result
        };
  }


  /**
   * Converts to an object of all current values.
   */
  toValues() {
    const result = {};
    FIELD_KEYS.forEach(key => { result[key] = this[key](); });
    return result;
  }


  /**
   * Gets or sets the display title.
   */
  // title(value) { return this[PROP]("title", value, { default: this.suite.name }); }


  /**
   * Gets or sets the sub-title.
   */
  // subtitle(value) { return this[PROP]("subtitle", value); }


  /**
   * Gets or sets the component properties.
   */
  props(value) { return this[PROP]("componentProps", value); }


  /**
   * Gets or sets the component children.
   */
  children(value) { return this[PROP]("componentChildren", value); }



  /**
   * Loads the given component.
   *
   * @param component
   */
  load(component, props, children) {
    // Setup initial conditions.
    if (!component) {
      if (isBrowser) { console.warn("Cannot load: a component was not specified (undefined/null)"); }
      return this;
    }
    let type;

    // If a created <element> was passed de-construct
    // it into it's component parts.
    if (component._isReactElement) {
      props = component.props;
      children = props.children;
      delete props.children;
      type = component.type;

    } else {
      type = component;
    }

    // Store on the current state.
    api.setCurrent({
      componentType: type,
      componentProps: props,
      componentChildren: children
    });

    // Finish up.
    api.loadInvokeCount += 1;
    return this;
  }
}

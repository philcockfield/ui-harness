import _ from "lodash";
import React from "react";
import api from "./api-internal";
import * as util from "js-util";
import { PropTypes } from "js-util/react";


const isBrowser = (typeof window !== 'undefined');
const PROP = Symbol("Prop");
const FIELD_KEYS = [
  "props",
  "children",
  "width",
  "height",
  "cropMarks",
  "cropMarks.size",
  "cropMarks.offset"
];


/**
 * The [this] context that is passed into the [describe/it]
 * BDD methods.
 */
export default class UIHContext {
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
          if (value !== undefined) {
            const propType = options.propType;
            if (propType) {
              const validation = PropTypes.validate({ value: propType }, { value: value });
              if (!validation.isValid) {
                throw new Error(`Invalid value for '${ key }': ${ value }`)
              }
            }

            if (options.resetOn !== undefined && value === options.resetOn) {
              value = options.default;
            }
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

    // Property extensions.
    this.cropMarks.size = (value) => { return this[PROP]("cropMarks.size", value, { default: 20 }); };
    this.cropMarks.offset = (value) => { return this[PROP]("cropMarks.offset", value, { default: 5 }); };
  }


  /**
   * Converts to an object of all current values.
   */
  toValues() {
    const result = {};
    FIELD_KEYS.forEach(key => {
          let propFunc = util.ns(this, key);
          result[key] = propFunc.call(this);
        });
    return result;
  }


  /**
   * Gets or sets the current properties.
   */
  props(value) { return this[PROP]("componentProps", value); }
  children(value) { return this[PROP]("componentChildren", value); }
  width(value) { return this[PROP]("width", value, { default: "auto", resetOn: null, propType:PropTypes.numberOrString }); }
  height(value) { return this[PROP]("height", value, { default: "auto", resetOn: null, propType:PropTypes.numberOrString }); }
  cropMarks(value) { return this[PROP]("cropMarks", value, { default: true }); }



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

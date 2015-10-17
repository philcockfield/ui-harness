import R from "ramda";
import React from "react";
import api from "./api-internal";
import * as util from "js-util";
import { css, PropTypes } from "js-util/react";
import AlignmentContainer from "react-atoms/components/AlignmentContainer";


const isBrowser = (typeof window !== "undefined");
const PROP = Symbol("Prop");
const PROPS = {
  "children": {
    key: "componentChildren" // Stored on {current} as this.
  },
  "width": {
    default: "auto",
    type: PropTypes.numberOrString,
    resetOn: null
  },
  "height": {
    default: "auto",
    type: PropTypes.numberOrString,
    resetOn: null
  },
  "cropMarks": {
    default: true,
    type: PropTypes.bool
  },
  "cropMarks.size": {
    default: 25,
    type: PropTypes.number
  },
  "cropMarks.offset": {
    default: 5,
    type: PropTypes.number
  },
  "margin": {
    default: 60,
    type: PropTypes.number
  },
  "align": {
    default: "center top",
    type: AlignmentContainer.propTypes.align
  },
  "header": {
    type: PropTypes.string
  },
  "footer": {
    type: PropTypes.string
  },
  "hr": {
    default: true,
    type: PropTypes.bool
  },
  "backdrop": {
    default: 0,
    type: PropTypes.numberOrString
  },
  "scroll": {
    default: false,
    type: PropTypes.oneOf([true, false, "x", "y", "x:y"])
   }
};


const getPropParent = (ns, obj) => (
  ns.length === 0
      ? obj
      : getPropParent(R.takeLast(ns.length - 1, ns), obj[ns[0]])
);



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
    this[PROP] = (key, value, options) => {
          options = options || PROPS[key] || {};
          key = options.key || key; // The property options may provide an alternative
                                    // key to store as on the {current} map.

          // WRITE.
          if (value !== undefined) {
            // Perform type validation.
            const type = options.type;
            if (type) {
              const validation = PropTypes.validate(type, value);
              if (!validation.isValid) {
                throw new Error(`Invalid '${ key }' value (${ value }). Should be ${ type.toString() }.`)
              }
            }

            // Reset the value if required.
            if (options.resetOn !== undefined && value === options.resetOn) {
              value = options.default;
            }

            // Store the value.
            this[PROP].state[key] = value;
            if (isCurrent()) { api.setCurrent({ [key]: value }); }
            return this; // When writing the [this] context is returned.
                         // This allows for chaining of write operations.
          }
          // READ.
          let result = this[PROP].state[key];
          if (result === undefined) { result = options.default; }
          return result
        };
    this[PROP].state = {};

    // Create property functions.
    Object.keys(PROPS).forEach(key => {
        const prop = PROPS[key];
        if (this[key]) { throw new Error(`Property named '${ key }' already exists.`); }

        // Ensure nested property extensions are added to the hierarchy.
        // ie. functions as properites of parent functions, for example:
        //     - cropMarks
        //     - cropMarks.size
        const parts = key.split(".");
        const ns = R.take(parts.length - 1, parts);
        const propName = R.takeLast(1, parts).join(".");
        const parent = getPropParent(ns, this)

        // Store the propery.
        parent[propName] = (value) => this[PROP](key, value);
    });

    // Property extension methods.
    this.log.clear = () => api.clearLog();
  }


  /**
   * Converts to an object of all current values.
   */
  toValues() {
    const result = {};
    Object.keys(PROPS).forEach(key => {
          let propFunc = util.ns(this, key);
          if (R.is(Function, propFunc)) {
            result[key] = propFunc.call(this);
          } else {
            result[key] = this[PROP].state[key];
          }
        });
    return result;
  }


  /**
   * Resets the UI Harness.
   */
  reset(options) { api.reset(options); }


  /**
   * Cumulatively sets property values on the current component.
   * @param {object} value:  An object containing {prop:value} to add
   */
  props(value) {
    // WRITE.
    if (R.is(Object, value)) {
      // Cumulatively add given props to the existing
      // props on the component.
      const component = api.component();
      let props = component && component.props;
      if (props) {
        props = R.clone(props);
        R.keys(value).forEach(key => props[key] = value[key]);
        value = props;
      }
    }

    // READ.
    return this[PROP]("componentProps", value);
  }



  /**
   * Loads the given component.
   *
   * @param component:  The component Type
   *                    or created component element (eg: <MyComponent/>).
   * @param props:      Optional. The component props (if not passed in with a component element).
   * @param children:   Optional. The component children (if not passed in with a component element).
   */
  load(component, props, children) {
    if (!component) {
      if (isBrowser) { console.warn("Cannot load: a component was not specified (undefined/null)"); }
    } else {
      api.loadComponent(component, props, children);
    }
    return this;
  }


  /**
   * Unloads the currently loaded component.
   */
  unload() {
    api.component(null);
    return this;
  }


  /**
   * Logs a value to the output.
   * @param {array} value: The value or values to append.
   */
   log(...value) {
     api.log(value);
     return this;
   }
}

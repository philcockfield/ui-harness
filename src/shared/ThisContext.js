import _ from "lodash";
import api from "./api-internal";

const PROP = Symbol("Prop");

const FIELD_KEYS = [
  "title",
  "subtitle"
];


/**
 * The [this] context that is passed into the [describe/it]
 * BDD methods.
 */
export default class UIHarnessContext {
  constructor(type) {
    this.type = type;

    const isCurrent = () => {
      console.log("TEMP");
      // return true; // TEMP
    };

    // Read/Write helper for data-methods.
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
  title(value) { return this[PROP]("title", value, { default: this.suite.name }); }


  /**
   * Gets or sets the sub-title.
   */
  subtitle(value) { return this[PROP]("subtitle", value); }

}

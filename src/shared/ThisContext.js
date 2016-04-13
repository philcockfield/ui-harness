import * as util from 'js-util';

import invariant from 'invariant';
import AlignmentContainer from 'react-atoms/components/AlignmentContainer';
import R from 'ramda';
import schema, { PropTypes } from 'react-schema';

import api from './api-internal';
import log from './log';
import page from './page';


const formatColorNumber = (value) => {
  if (R.is(Number, value)) {
    value = R.clamp(0, 1, value);
  }
  return value;
};

const PROP = Symbol('Prop');
const PROPS = {
  children: {
    key: 'componentChildren', // Stored on {current} as this.
  },
  childContextTypes: {
    key: 'componentChildContextTypes',
    type: PropTypes.object,
  },
  width: {
    default: 'auto',
    type: PropTypes.numberOrString,
    resetOn: null,
  },
  height: {
    default: 'auto',
    type: PropTypes.numberOrString,
    resetOn: null,
  },
  cropMarks: {
    default: true,
    type: PropTypes.bool,
  },
  'cropMarks.size': {
    default: 25,
    type: PropTypes.number,
  },
  'cropMarks.offset': {
    default: 5,
    type: PropTypes.number,
  },
  margin: {
    default: 60,
    type: PropTypes.number,
  },
  align: {
    default: 'center top',
    type: AlignmentContainer.propTypes.align,
  },
  header: {
    type: PropTypes.string,
  },
  footer: {
    type: PropTypes.string,
  },
  hr: {
    default: true,
    type: PropTypes.bool,
  },
  backdrop: {
    default: 0,
    type: PropTypes.numberOrString,
    format: formatColorNumber,
  },
  background: {
    type: PropTypes.numberOrString,
    format: formatColorNumber,
  },
  scroll: {
    default: false,
    type: PropTypes.oneOf([true, false, 'x', 'y', 'x:y']),
  },
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
      const currentSuite = api.current.get('suite');
      return (currentSuite && currentSuite.id === this.suite.id);
    };

    // Read|Write helper for data-property methods.
    this[PROP] = (key, value, options) => {
      options = options || PROPS[key] || {};
      key = options.key || key; // The property options may provide an alternative
                                // key to store as on the {current} map.

      // WRITE.
      if (value !== undefined) {
        // Format the value if a formatter function was provided.
        if (R.is(Function, options.format)) {
          value = options.format(value);
        }

        // Perform type validation.
        const type = options.type;
        if (type) {
          const validation = schema.validate(type, value);
          if (!validation.isValid) {
            const msg = `Invalid '${ key }' value (${ value }). Should be ${ type.toString() }.`;
            throw new Error(msg);
          }
        }

        // Reset the value if required.
        if (options.resetOn !== undefined && value === options.resetOn) {
          value = options.default;
        }

        // Store the value.
        this[PROP].state[key] = value;
        if (isCurrent()) {
          api.setCurrent(this[PROP].state); // Update the state after every update
        }
        return this; // When writing the [this] context is returned.
                     // This allows for chaining of write operations.
      }
      // READ.
      let result = this[PROP].state[key];
      if (result === undefined) { result = options.default; }
      return result;
    };
    this[PROP].state = {};

    // Create property functions.
    Object.keys(PROPS).forEach(key => {
      if (this[key]) { throw new Error(`Property named '${ key }' already exists.`); }

      // Ensure nested property extensions are added to the hierarchy.
      // ie. functions as properites of parent functions, for example:
      //     - cropMarks
      //     - cropMarks.size
      const parts = key.split('.');
      const ns = R.take(parts.length - 1, parts);
      const propName = R.takeLast(1, parts).join('.');
      const parent = getPropParent(ns, this);

      // Store the propery.
      parent[propName] = (value) => this[PROP](key, value);
    });

    // Property extension methods.
    this.log.clear = () => api.clearLog();
  }


  /*
  API for manipulating the containing page.
  */
  page = page(this);


  /**
   * Converts to an object of all current values.
   */
  toValues() {
    const result = {};
    Object.keys(PROPS).forEach(key => {
      const propFunc = util.ns(this, key);
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
    let _value = value;
    // WRITE.
    if (R.is(Object, _value)) {
      // Cumulatively add given props to the existing
      // props on the component.
      const props = this[PROP]('componentProps');
      // No need to clone when using R.merge
      _value = R.merge(props, _value);
    }
    // READ.
    return this[PROP]('componentProps', _value);
  }

  /**
   * Cumulatively sets context values on the current component.
   * @param {object} value:  An object containing {context: value} to add
   */
  context(value) {
    const currentContextTypes = this[PROP]('componentChildContextTypes');

    invariant(
      // If we're setting the value to nothing, it doesn't need to have a context type
      currentContextTypes || !value,
      'Make sure you set `this.contextTypes` before trying to set `this.context`.'
    );

    if (R.is(Object, value)) {
      // Cumulatively add given props to the existing context
      const context = this[PROP]('componentContext') || {};
      R.map(
        key => invariant(
          currentContextTypes[key],
          `Context key ${key} not specified in contextTypes. Add to context types using this.contextTypes` // eslint-disable-line max-len
        ),
        R.keys(value)
      );
      value = R.merge(context, value);
    }

    return this[PROP](
      'componentContext',           // Set the component's context to the value passed
      value,                        // and make sure it conforms to the context types
      { type: PropTypes.object },   // specified when the component was loaded.
    );
  }


  /**
   * OBSOLETE: Stub for the `component` method, emitting a warning that it will
   * be deprecated in a future version.
   */
  load(component) {
    log.warn('The `load` method is deprecated. Please use the `this.component` method.');
    return this.component(component);
  }




  /**
   * Loads the given component.
   *
   * @param component:  The component Type (e.g. MyComponent)
   *                    or created component element (e.g.: <MyComponent/>).
   */
  component(component) {
    invariant(component, 'Cannot load: a component was not specified (undefined/null)');

    // Create a props object of any props set by this.props with props
    // passed down by JSX.
    const props = R.merge(
      this[PROP]('componentProps'), // Existing props from this.props()
      R.omit('children', component.props) // Don't include props.children in
                                          // props plucked from JSX
    );

    // Update the props in internal state.
    this[PROP]('componentProps', props);

    // Find the children of the passed JSX component (if any).
    const children = R.path(['props', 'children'], component);

    // Update internal state with these children.
    if (children) this[PROP]('componentChildren', children);

    // Load the component in the window.
    api.loadComponent(component);

    // Update the window state with internal state
    api.setCurrent(this[PROP].state);
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

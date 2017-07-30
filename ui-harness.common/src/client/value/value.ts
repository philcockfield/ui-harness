import * as R from 'ramda';



/**
 * Returns a copy of the array with falsey values removed.
 * Removes:
 *   - null
 *   - undefined
 *   - empty-string ('')
 *
 * @param {Array} value: The value to examine.
 * @return {Array}.
 */
export const compact = (value: any[]) => R.pipe(
  R.reject(R.isNil),
  R.reject(R.isEmpty),
)(value);



/**
 * Determines whether the value is a simple object (ie. not a class instance).
 * @param value: The value to examine.
 * @return {Boolean}.
 */
export const isPlainObject = (value: any): boolean => {
  if (R.is(Object, value) === false) { return false; }

  // Not plain if it has a modified constructor.
  const ctr = value.constructor;
  if (typeof ctr !== 'function') { return false; }

  // If has modified prototype.
  const prot = ctr.prototype;
  if (R.is(Object, prot) === false) { return false; }

  // If the constructor does not have an object-specific method.
  if (prot.hasOwnProperty('isPrototypeOf') === false) { return false; }

  // Finish up.
  return true;
};



/**
 * A safe way to test any value as to wheather is is 'blank'
 * meaning it can be either:
 *   - null
 *   - undefined
 *   - empty-string ('')
 *   - empty-array ([]).
 */
export const isBlank = (value: any): boolean => {
  if (value === null || value === undefined) { return true; }
  if (R.is(Array, value) && compact(value).length === 0) { return true; }
  if (R.is(String, value) && value.trim() === '') { return true; }
  return false;
};



/**
 * Determines whether the given value is a number, or can be
 * parsed into a number.
 *
 * NOTE: Examines string values to see if they are numeric.
 *
 * @param value: The value to examine.
 * @returns true if the value is a number.
 */
export const isNumeric = (value: any) => {
  if (isBlank(value)) { return false; }
  const num = parseFloat(value);
  if (num === undefined) { return false; }
  if (num.toString().length !== value.toString().length) { return false; }
  return !Number.isNaN(num);
};



/**
 * Determines whether the given value is a Promise.
 */
export const isPromise = (value?: any) => R.is(Object, value) && R.is(Function, value.then);



/**
 * Converts a value to a number if possible.
 * @param value: The value to convert.
 * @returns the converted number, otherwise the original value.
 */
export const toNumber = (value: any) => {
  if (isBlank(value)) { return value; }
  const num = parseFloat(value);
  if (num === undefined) { return value; }
  if (num.toString().length !== value.toString().length) { return value; }
  return Number.isNaN(num) ? value : num;
};


/**
 * Converts a value to boolean (if it can).
 * @param value: The value to convert.
 * @param defaultValue: The value to return if the given value is null/undefined.
 * @returns the converted boolean, otherwise the original value.
 */
export const toBool = (value: any, defaultValue: any = undefined) => {
  if (R.isNil(value)) { return defaultValue; }
  if (R.is(Boolean, value)) { return value; }
  const asString = value.toString().trim().toLowerCase();
  if (asString === 'true') { return true; }
  if (asString === 'false') { return false; }
  return defaultValue;
};



/**
 * Converts a string it's actual type if it can be derived.
 * @param {string} string: The string to convert.
 * @return the original or converted value.
 */
export const toType = (value: any) => {
  if (!R.is(String, value)) { return value; }
  const lowerCase = value.toLowerCase().trim();

  // Boolean.
  if (lowerCase === 'true') { return true; }
  if (lowerCase === 'false') { return false; }

  // Number.
  const num = toNumber(lowerCase);
  if (R.is(Number, num)) { return num; }

  // Originanl type.
  return value;
};



/**
 * Rounds to the given precision
 */
export function round(value: number, precision: number = 0) {
  const multiplier = Math.pow(10, precision || 0);
  return Math.round(value * multiplier) / multiplier;
}




/**
 * Walks an object tree implementing a visitor callback for each item.
 */
export const walk = (obj: any | any[], fn: (obj: any | any[]) => void) => {
  const process = (item: any) => {
    fn(item);
    if (R.is(Object, item) || R.is(Array, item)) {
      walk(item, fn); // <== RECURSION.
    }
  };
  if (R.is(Array, obj)) {
    (obj as any[]).forEach((item) => process(item));
  } else {
    Object.keys(obj).forEach((key) => process(obj[ key ]));
  }
};

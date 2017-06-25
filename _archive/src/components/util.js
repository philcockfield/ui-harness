import R from 'ramda';
import Color from 'color';


export const css = require('js-util/lib/react-css').default;
export const PropTypes = require('react-schema').PropTypes;


/**
 * Converts a number between 0..1 to a greyscale color (opacity of black).
 *   1 == black
 *   0 == white
 * @param {Number|String} value:  The value to convert.
 *                                Ignore (returns) strings.
 * @return {String} a hex value.
 */
export const numberToGreyscale = (value) => {
  if (R.is(Number, value)) {
    value = R.clamp(0, 1, value);
    value = Color('white').darken(value).hexString();
  }
  return value;
};

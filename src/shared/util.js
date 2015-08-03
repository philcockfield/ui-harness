import _ from "lodash";
import * as util from "js-util";


/**
 * Formats text for display.
 * @param {string} text: The text for format.
 * @return {string} HTML.
 */
export const formatText = (text) => {
  if (util.isBlank(text)) { return text; }
  return text;
};

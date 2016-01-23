import * as util from "js-util";
import marked from "marked";



/**
 * Formats text for display.
 * @param {string} text: The text for format.
 * @return {string} HTML.
 */
export const formatText = (text) => {
  if (util.isBlank(text)) { return text; }
  text = text.toString();
  text = escapeHtml(text);
  text = marked(text);
  text = text.substring(3, text.length - 5) // Remove the wrapping <p>...</p> tags.
  return text;
};


/**
 * Converts HTML chars into escaped versions.
 */
export const escapeHtml = (text) => {
  let isWithinBlock = false;
  let result = '';
  let i = 0;
  for (let char of text) {
    // Don't escape <HTML> that is wihtin the markdown `tick` block.
    if (char === "`") { isWithinBlock = !isWithinBlock; }
    if (!isWithinBlock) {
      if (char === "<") { char = "&lt;"; }
      if (char === ">") { char = "&gt;"; }
    }
    result += char
    i += 1;
  }
  return result;
};

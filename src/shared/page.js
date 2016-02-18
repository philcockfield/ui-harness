import R from 'ramda';


const elementExists = (parentElement, tag, props = {}) => {
  const elements = document.head.getElementsByTagName(tag);
  const isMatch = (el) => R.all(
    key => R.is(Function, props[key]) || el[key] === props[key],
    Object.keys(props)
  );
  return R.any(isMatch, elements);
};






/**
 * API for manipulating the containing page.
 */
export default {

/**
 * Inserts a new element into the DOM.
 *
 * WARNING: Typically you don't want to do this when using React.
 *          This is for things like inserting a SCRIPT tag, or a
 *          LINK into the head of the document.
 *
 * @param {DomElement} parentElement: The element to append.
 * @param {String} tag: The name of the element tag.
 * @param {Object} props: An object containing the {attr:value} to apply.
 *
 * @return {Boolean} True if the element was inserted, or
 *                   False if the element already existed.
 */
  insert(parentElement, tag, props = {}) {
    const exists = elementExists(parentElement, tag, props);
    if (!exists) {
      const el = document.createElement(tag);
      Object.keys(props).forEach(key => el[key] = props[key]);
      parentElement.appendChild(el);
    }
    return !exists;
  },


  /**
   * Inserts a <link> into the <head>.
   * @param {Object} props: An object containing the {attr:value} to apply.
   * @return {Boolean} True if the link was inserted, or
   *                   False if the link already existed.
   */
  insertLink(props = {}) {
    return this.insert(document.head, 'link', props);
  },


  /**
   * Inserts a <link> to a webfont into the <head>.
   * @param {String} url: The URL to the web-font.
   * @return {Boolean} True if the link was inserted, or
   *                   False if the link already existed.
   */
  // insertFont: (url) => this.insertLink({ rel: 'stylesheet', type: 'text/css' }),
  insertFont(url) {
    return this.insertLink({ href: url, rel: 'stylesheet', type: 'text/css' });
  },
};

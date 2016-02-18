import R from 'ramda';
const IS_BROWSER = (typeof window !== 'undefined');


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
export default (context) => ({
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
   * @return {Object} The 'this' context for chaining.
   */
  insert(parentElement, tag, props = {}) {
    if (IS_BROWSER) {
      const exists = elementExists(parentElement, tag, props);
      if (!exists) {
        const el = document.createElement(tag);
        Object.keys(props).forEach(key => el[key] = props[key]);
        parentElement.appendChild(el);
      }
    }
    return context;
  },


  /**
   * Inserts a <link> into the <head>.
   * @param {Object} props: An object containing the {attr:value} to apply.
   * @return {Object} The 'this' context for chaining.
   */
  insertLink(props = {}) {
    if (IS_BROWSER) {
      this.insert(document.head, 'link', props);
    }
    return context;
  },


  /**
   * Inserts a <link> to a webfont into the <head>.
   * @param {String} url: The URL to the web-font.
   * @return {Object} The 'this' context for chaining.
   */
  // insertFont: (url) => this.insertLink({ rel: 'stylesheet', type: 'text/css' }),
  insertFont(url) {
    if (IS_BROWSER) {
      this.insertLink({ href: url, rel: 'stylesheet', type: 'text/css' });
    }
    return context;
  },
});

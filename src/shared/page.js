import R from 'ramda';
const IS_BROWSER = (typeof window !== 'undefined');


const elementExists = (parentElement, tag, props = {}, childElement) => {
  const elements = document.head.getElementsByTagName(tag);

  // Get the child <element> content as text for matching.
  let childText = '';
  if (childElement) {
    const div = document.createElement('div');
    div.appendChild(childElement);
    childText = div.innerText;
  }

  const hasMatchingContent = (el) => el.innerText === childText;
  const isMatchingProp = (el, key) => R.is(Function, props[key]) || el[key] === props[key];
  const hasMatchingProps = (el) => R.all(key => isMatchingProp(el, key), Object.keys(props));
  const isMatch = (el) => hasMatchingProps(el) && hasMatchingContent(el);
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
   * @param {Object} childElement: The child of the new element.
   *
   * @return {Object} The 'this' context for chaining.
   */
  insert(parentElement, tag, props = {}, childElement) {
    if (IS_BROWSER) {
      const exists = elementExists(parentElement, tag, props, childElement);
      if (!exists) {
        const el = document.createElement(tag);
        Object.keys(props).forEach(key => el[key] = props[key]);
        if (childElement) {
          el.appendChild(childElement);
        }
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
   * @param {String|Array} url: The URL(s) to the web-font.
   * @return {Object} The 'this' context for chaining.
   */
  // insertFont: (url) => this.insertLink({ rel: 'stylesheet', type: 'text/css' }),
  insertFont(url) {
    if (IS_BROWSER) {
      url = R.is(Array, url) ? url : [url];
      url.forEach(item => {
        this.insertLink({ href: item, rel: 'stylesheet', type: 'text/css' });
      });
    }
    return context;
  },


  /**
   * Inserts a script.
   * @param {String|Object} value:
   *                          - If a script is passed it is considered the script content itself.
   *                          - If an object is passed it is considered the props of the <script>
   *                            use this to pass a { src } value.
   *
   */
  insertScript(value) {
    if (IS_BROWSER) {
      if (R.is(Object, value)) {
        // Ensure the src has a full URL.
        //    Note: This is required for matching the existence of the <script> in the future
        //    as the browser automatically inserts the full URL on the DOM element itself.
        if (R.is(String, value.src) && value.src.startsWith('/')) {
          value.src = `${ location.origin }${ value.src }`;
        }
        this.insert(document.head, 'script', value);
      } else if (R.is(String, value)) {
        // Raw JS code has been given.  Insert it within the script.
        this.insert(document.head, 'script', {}, document.createTextNode(value));
      }
    }
    return context;
  },
});

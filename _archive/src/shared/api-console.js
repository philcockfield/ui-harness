import api from './api-internal';


/**
 * The API for manipulating the UIHarness via
 * the browser console.
 */
class UIHarness {
  constructor() {
    this.log.clear = () => api.clearLog();
  }

  /**
   * Resets the state of the UIHarness.
   * @param {boolean} hard: Flag indicating if all state from local-storage
   *                        should be cleared away, or just current selection state.
   */
  reset({ hard = false } = {}) {
    api.reset({ hard });
    return true;
  }


  /**
   * Logs a value to the output.
   * @param {array} value: The value or values to append.
   */
  log(...value) { api.log(value); }
}


export default new UIHarness();

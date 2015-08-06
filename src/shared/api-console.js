import api from "./api-internal";

/**
 * The API for manipulating the UIHarness via
 * the browser console.
 */
class UIHarness {

  /**
   * Resets the state of the UIHarness.
   * @param {boolean} hard: Flag indicating if all state from local-storage
   *                        should be cleared away, or just current selection state.
   */
  reset({ hard = false } = {}) {
    api.reset({ hard: hard });
    return true;
  }
}


export default new UIHarness();

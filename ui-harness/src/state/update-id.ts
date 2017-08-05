import { constants } from '../common';


/**
 * Retrieves the current update-id.
 */
export function current() {
  return constants.GLOBAL_STATE.UPDATE_ID;
}


/**
 * Increases the current update-id by one.
 */
export function increment() {
  constants.GLOBAL_STATE.UPDATE_ID += 1;
  return current();
}

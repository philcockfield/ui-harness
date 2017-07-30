const stringHash = require('string-hash');



/**
 * Promised based `setTimeout`.
 */
export async function delay(msecs: number, func: () => void) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        func();
        resolve();
      } catch (error) {
        reject(error);
      }
    }, msecs);
  });
}



/**
 * Hashes a string.
 */
export function hash(value: string) {
  return stringHash(value);
}

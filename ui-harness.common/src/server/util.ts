import { Glob } from 'glob';



export interface IRsyncResult {
  err: Error;
  code: number;
  cmd: string;
}
export function rsyncExecute(rsync: any): Promise<IRsyncResult> {
  return new Promise<IRsyncResult>((resolve, reject) => {
    rsync.execute((err: Error, code: number, cmd: string) => {
      if (err) {
        reject(err);
      } else {
        resolve({ err, code, cmd });
      }
    });
  });
}




export interface IGlobOptions {
  nodir?: boolean;
  dot?: boolean;
  ignore?: string;
}

/**
 * Matches the given glob pattern as a promise.
 * See:
 *    https://www.npmjs.com/package/glob
 */
export function glob(pattern: string, options: IGlobOptions = {}): Promise<string[]> {
  return new Promise<string[]>((resolve, reject) => {
    new Glob(pattern, options, (err, matches) => { // tslint:disable-line
      if (err) {
        reject(err);
      } else {
        resolve(matches);
      }
    });
  });
}


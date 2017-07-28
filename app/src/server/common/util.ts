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


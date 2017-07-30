export interface IRsyncResult {
    err: Error;
    code: number;
    cmd: string;
}
export declare function rsyncExecute(rsync: any): Promise<IRsyncResult>;
export interface IGlobOptions {
    nodir?: boolean;
    dot?: boolean;
    ignore?: string;
}
export declare function glob(pattern: string, options?: IGlobOptions): Promise<string[]>;

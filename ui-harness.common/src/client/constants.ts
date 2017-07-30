export const IS_BROWSER = typeof window !== 'undefined';
export const GLOBAL: any = IS_BROWSER ? window : global;

import { ISuite } from '../types';

export const IS_BROWSER = typeof window !== 'undefined';
export const GLOBAL: any = IS_BROWSER ? window : global;


export interface ISuites {
  [key: string]: ISuite;
}

GLOBAL.__UIHARNESS_SUITES__ = (GLOBAL.__UIHARNESS_SUITES__ || {});
export const SUITES: ISuites = GLOBAL.__UIHARNESS_SUITES__;

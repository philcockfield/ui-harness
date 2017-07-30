import { ISuite, ISuites } from '../types';

export const IS_BROWSER = typeof window !== 'undefined';
export const GLOBAL: any = IS_BROWSER ? window : global;


export const PLACEHOLDER = '__PLACEHOLDER__';



export interface IGlobalState {
  UPDATE_ID: number;
  SUITES: ISuites;
}

GLOBAL.__UIHARNESS__ = (GLOBAL.__UIHARNESS__ || {
  UPDATE_ID: 0,
  SUITES: {},
});
export const GLOBAL_STATE: IGlobalState = GLOBAL.__UIHARNESS__;
export const SUITES: ISuites = GLOBAL.__UIHARNESS__.SUITES;

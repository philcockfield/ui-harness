import { ISuite, ISuites } from '../types';
import { IS_BROWSER, GLOBAL } from 'ui-harness.common/lib/client/constants';


export { IS_BROWSER, GLOBAL };
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

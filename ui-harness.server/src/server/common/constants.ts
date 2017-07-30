import { fsPath } from './libs';

export * from '../../common/constants';
export const IS_DEV = process.env.NODE_ENV !== 'production';
export const UIHARNESS_MODULE_DIR = fsPath.join(__dirname, '../../..');
export const BUILD_DIR = fsPath.resolve('./.build');


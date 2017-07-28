import { fsPath } from './libs';

export * from '../../common/constants';
export const IS_DEV = process.env.NODE_ENV !== 'production';
export const MODULE_PATH = fsPath.join(__dirname, '../../..');


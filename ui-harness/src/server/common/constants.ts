import { fsPath } from './libs';

export * from '../../common/constants';
export { IS_DEV } from 'ui-harness.common/lib/server/constants';


export const UIHARNESS_MODULE_DIR = fsPath.join(__dirname, '../../..');
export const BUILD_DIR = fsPath.resolve('./.build');


import 'babel-polyfill';
import start from './start';
import build from './build';

/**
 * Flag indicating that the application is running within
 * the context of the UIHarness.
 */
global.__UIHARNESS__ = false; // False until the UIHarness environment is started.


// Server API.
export default { start, build };

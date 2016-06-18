/* eslint max-len:0, no-useless-escape:0 */

import R from 'ramda';
import fs from 'fs-extra';
import fsPath from 'path';
import chalk from 'chalk';
import log from '../shared/log';



/**
 * Retrieves the absolute path to the root module, which will be either:
 *   - the referencing parent module (typically)
 *   - or the ui-harness itself (when under development).
 *
 * @return {String}.
 */
export const rootModulePath = () => {
  const parent = fsPath.resolve('../');
  return fsPath.basename(parent) === 'node_modules'
    ? fsPath.resolve('../../')
    : fsPath.resolve('./');
};



const ROOT_PATH = rootModulePath();



/**
 * Trims the root module path from the given path (if it exists).
 * @param {String} path: The path to modify.
 * @return {String}.
 */
export const trimRootModulePath = (path) => {
  if (!R.is(String, path)) { return path; }
  return path.startsWith(ROOT_PATH)
            ? `.${ path.substr(ROOT_PATH.length, path.length) }`
            : path;
};



/**
 * Prepare entry paths for the WebPack bundle.
 *
 * @param {String|Array} entry: Paths to entry points of files to pass
 *                              to WebPack to build for the client.
 *
 * @return {Object} of paths.
 */
export const formatEntryPaths = (entry) => {
  entry = entry || [];
  if (!R.is(Array, entry)) { entry = [entry]; }
  if (entry.length === 0) {
    entry.push('./specs');
    entry.push('./src/specs');
  }
  return entry
    // Ensure there is a specific index.js entry file if only a folder was given.
    // NB: Not having a specific entry file can cause build-errors in WebPack.
    .map(path => (path.endsWith('.js') || path.endsWith('.jsx')
        ? path
        : `${ path }/index.js`))

    // Escape white-spaces within paths.
    .map(path => path.replace(/ /, '\ '))

    // Resolve relative (.) paths into fully-qualified paths.
    .map(path => (path.startsWith('.') ? fsPath.resolve(path) : path))

    // Remove any paths that don't actually exist.
    .filter(path => fs.existsSync(path));
};





/**
 * Prepare spec paths for the WebPack bundle.
 *
 * @param {String|Array} entry: Paths to entry points of files to pass
 *                              to WebPack to build for the client.
 *
 * @return {Object} of paths.
 */
export const formatSpecPaths = (entry) => {
  const paths = formatEntryPaths(entry);

  // Check for non-standard characters within the paths.
  paths.forEach(path => {
    if (!path.match(/^[a-z0-9\.\-\_\s\/]+$/i)) {
      log.warn(chalk.red('WARNING Path contains non-standard characters. Auto-reloading may not work.'));
      log.warn(chalk.red('        Hint: Brackets in the path "(...)" will cause problems.'));
      log.warn(chalk.cyan(`        ${ path }`));
      log.warn('');
    }
  });

  // Finish up.
  return paths;
};

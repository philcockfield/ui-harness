
import R from 'ramda';
import fs from 'fs-extra';
import fsPath from 'path';
import jsYaml from 'js-yaml';
import { isBlank } from 'js-util';
import { rootModulePath } from './paths';

const ROOT_PATH = rootModulePath();

const formatPath = (path) => {
  if (!R.is(String, path)) { return path; }
  path = path.trim();
  return path.startsWith('.')
    ? fsPath.join(ROOT_PATH, path)
    : path;
};

const toFileExtensionRegEx = (item) => {
  if (!(item instanceof RegExp)) {
    item = item.replace(/\./g, '\\.');
    item = new RegExp(`${ item }$`);
  }
  return item;
};






/**
 * Parses the given YAML text into a config object.
 * @param {String} text: The raw YAML to parse.
 * @return {Object} config.
 */
export const parse = (text) => {
  // Parse the YAML.
  let yaml;
  try {
    yaml = jsYaml.safeLoad(text) || {};
  } catch (err) {
    throw new Error(`The [.uiharness.yml] file is invalid. ${ err.message }`);
  }

  // Format entry path.
  if (R.is(String, yaml.entry)) {
    yaml.entry = yaml.entry.split(',');
  }
  yaml.entry = yaml.entry || [];
  if (yaml.entry.length === 0) {
    yaml.entry[0] = './src/specs';
  }
  yaml.entry = yaml.entry.map(formatPath);

  // Format GraphQL path.
  if (yaml.graphqlSchema) {
    yaml.graphqlSchema = formatPath(yaml.graphqlSchema);
  }

  // Format css-modules.
  let cssModules = yaml.cssModules;
  if (cssModules) {
    cssModules = R.is(Array, cssModules) ? cssModules : [cssModules];
    cssModules = cssModules.map(toFileExtensionRegEx);
    yaml.cssModules = cssModules;
  }

  // Finish up.
  return yaml;
};



/**
 * Loads and parses the YAML file at the given location.
 *
 * @param {String} path:  Optional. The path to the YAML config file to load.
 *                        If not specified a path to [.uiharness.yml] in the root
 *                        of the project is used.
 *
 * @return {Object} config OR undefined if the file does not exist.
 */
export const load = (path) => {
  // Setup initial conditions.
  path = isBlank(path) ? fsPath.join(ROOT_PATH, '.uiharness.yml') : path;
  path = path.startsWith('.') ? fsPath.resolve(path) : path;

  // Ensure the path exists.
  if (!fs.existsSync(path)) { return undefined; }

  // Load and parse the file.
  const yaml = fs.readFileSync(path, 'utf8');
  return parse(yaml);
};

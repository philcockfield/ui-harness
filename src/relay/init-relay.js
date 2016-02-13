import Promise from 'bluebird';
import fs from 'fs-extra';
import fsPath from 'path';
import updateSchema from './update-schema';
import { rootModulePath } from '../server/paths';

const ROOT_PATH = rootModulePath();


/**
 * Initializes Relay, ensuring the GraphQL [schema.json] exists and
 * the relay-babel plugin has access to it.
 *
 * @param {String} schemaPath:  The absolute path to the GraphQL
 *                              `schema.js` or `schema.json` file.
 *
 * @return {Promise}.
 */
export default (schemaPath) => new Promise((resolve, reject) => {
  (async () => {
    // Resolve to an absolute path.
    schemaPath = schemaPath.startsWith('.')
        ? fsPath.join(ROOT_PATH, schemaPath)
        : schemaPath;

    // Ensure the schema exists.
    if (!fs.existsSync(schemaPath)) {
      const msg = `The GraphQL JS schema file path '${ schemaPath }' does not exist.`;
      return reject(new Error(msg));
    }

    // Extract path information.
    const isJson = schemaPath.endsWith('.json');
    const dir = fsPath.dirname(schemaPath);
    const file = fsPath.basename(schemaPath, isJson ? '.json' : '.js');
    const jsonPath = fsPath.join(dir, `${ file }.json`);

    // Ensure the [schema.json] exists.
    if (!isJson && !fs.existsSync(jsonPath)) {
      try {
        await updateSchema(schemaPath, dir, file);
      } catch (err) {
        return reject(err);
      }
    }

    // Initialize the plugin with the path to the [schema.json].

    // HACK:  Store the path to the GraphQL Schema in a global variable.
    //        This is so the path can be dynamically set for the `babel-relay-plugin`
    //        and not hard-coded, which is the only way the Realy samples show how this works.
    //        There is no apparent way to pass an actual instance of the `babel-relay-plugin`
    //        (with the schema path dynamically set) into the WebPack babel-loader.
    global.__relayPluginSchemaJsonPath = jsonPath;
    require('./babel-relay-plugin');

    // Finish up.
    resolve({ jsonPath });
  })();
});

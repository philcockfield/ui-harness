import R from 'ramda';
import Promise from 'bluebird';
import fs from 'fs-extra';
import fsPath from 'path';
import updateSchema from './update-schema';


/**
 * Initializes Relay, ensuring the GraphQL [schema.json] exists and
 * the relay-babel plugin has access to it.
 *
 * @param {String} schemaPath: The absolute path to the GraphQL `schema.js`.
 *
 * @return {Promise}.
 */
export default (schemaPath) => new Promise((resolve, reject) => {
  (async () => {

    // Setup initial conditions.
    if (!fs.existsSync(schemaPath)) {
      const msg = `The GraphQL JS schema file path '${ schemaPath }' does not exist.`;
      return reject(new Error(msg));
    }

    // Extract path information.
    const dir = fsPath.dirname(schemaPath);
    const file = fsPath.basename(schemaPath, ".js");
    const jsonPath = fsPath.join(dir, `${ file }.json`);

    // Ensure the [schema.json] exists.
    if (!fs.existsSync(jsonPath)) {
      try {
        await updateSchema(schemaPath, dir, file);
      } catch (err) {
        return reject(err);
      }
    }

    // Initialize the plugin with the path to the [schema.json].

    // HACK:  Momentarily store the path to the GraphQL Schema in a global variable.
    //        This is so the path can be dynamically set for the `babel-relay-plugin`
    //        and not hard-coded, which is the only way the Realy samples show how this works.
    //        There is no apparent way to pass an actual instance of the `babel-relay-plugin`
    //        (with the schema path dynamically set) into the WebPack babel-loader.
    global.__relayPluginSchemaJsonPath = jsonPath;
    require('./babel-relay-plugin');
    delete global.__relayPluginSchemaJsonPath;

    // Finish up.
    resolve({ jsonPath });
  })();
});

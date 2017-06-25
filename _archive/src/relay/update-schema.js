import fs from 'fs-extra';
import { isBlank } from 'js-util/lib/util';
import { graphql, GraphQLSchema } from 'graphql';
import { introspectionQuery, printSchema } from 'graphql/utilities';



/**
 * Updates the schema at the given path.
 *
 * @param {String} schemaPath: The absolute path to the schema JS file to build.
 *                             The file must export a { Schema } field.
 *
 * @param {String} outputDir: The absolute directory to save the file to.
 *
 * @param {String} outputFile: The name of the files (.json and .graphql) to wirte.
 *                             Default: 'schema'.
 *
 */
export default (schemaPath, outputDir, outputFile = 'schema') => new Promise((resolve, reject) => {

  // Setup initial conditions.
  if (isBlank(outputDir)) {
    reject(new Error('An output directory was not specified'));
    return;
  }
  const paths = {
    json: `${ outputDir }/${ outputFile }.json`,
    graphql: `${ outputDir }/${ outputFile }.graphql`,
  };

  // Ensure the schema exists.
  if (!fs.existsSync(schemaPath)) {
    reject(new Error(`A schema at the path '${ schemaPath }' does not exist.`));
    return;
  }
  const Schema = require(schemaPath).Schema;
  if (!(Schema instanceof GraphQLSchema)) {
    reject(
      new Error(`The module at the path '${ schemaPath }' does not expose a {Schema}.`)
    );
    return;
  }

  (async () => {
    // Save JSON of full schema introspection for Babel Relay Plugin to use.
    const jsonResult = await (graphql(Schema, introspectionQuery));
    if (jsonResult.errors) {
      const error = new Error('Failed while introspecting schema.');
      error.errors = jsonResult.errors;
      reject(error);
      return;
    }
    fs.outputFileSync(
      paths.json,
      JSON.stringify(jsonResult, null, 2)
    );

    // Save user readable type system shorthand of schema.
    fs.outputFileSync(paths.graphql, printSchema(Schema));

    // Finish up.
    resolve({ paths });
  })();
});

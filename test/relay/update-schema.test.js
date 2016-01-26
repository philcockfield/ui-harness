import { expect } from 'chai';
import fs from 'fs-extra';
import fsPath from 'path';
import updateSchema from '../../src/relay/update-schema';

const OUTPUT_DIR = fsPath.resolve("./test/.temp");
const SCHEMA_PATH = fsPath.resolve("./test/relay/data/schema.js");


describe('update-schema', function() {
  afterEach(() => fs.removeSync(OUTPUT_DIR));

  it('rejects if the schema path does not exist', (done) => {
    updateSchema('/path/not/exist', OUTPUT_DIR)
      .catch(err => {
        expect(err.message).to.contain("does not exist");
        done();
      });
  });

  it('saves the introspection JSON (default name)', (done) => {
    return updateSchema(SCHEMA_PATH, OUTPUT_DIR)
      .then(result => {
        const file = require(result.paths.json);
        expect(file.data.__schema.queryType.name).to.equal("Query");
        done();
      })
      .catch(err => console.error(err));
  });

  it('saves the human readable version .graphql file (default name)', (done) => {
    return updateSchema(SCHEMA_PATH, OUTPUT_DIR)
      .then(result => {
        const file = fs.readFileSync(result.paths.graphql).toString('utf8');
        expect(file).to.contain("type WidgetConnection {");
        expect(file).to.contain("cursor: String!");
        done();
      })
      .catch(err => console.error(err));
  });

  it('saves with custom file name', (done) => {
    return updateSchema(SCHEMA_PATH, OUTPUT_DIR, "foo")
      .then(result => {
        expect(fs.existsSync(`${ OUTPUT_DIR }/foo.json`)).to.equal(true);
        expect(fs.existsSync(`${ OUTPUT_DIR }/foo.graphql`)).to.equal(true);
        done();
      })
      .catch(err => console.error(err));
  });
});

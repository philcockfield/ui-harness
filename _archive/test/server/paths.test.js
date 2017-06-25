import fs from 'fs-extra';
import fsPath from 'path';
import { expect } from 'chai';
import * as paths from '../../src/server/paths';



describe('server/paths', function() {

  it('rootModulePath', () => {
    expect(paths.rootModulePath()).to.equal(fsPath.resolve('./'));
  });


  describe('closestModulePath', function() {
    const ROOT_DIR = fsPath.join(__dirname, '.paths.test')
    const dir = (path) => fsPath.join(ROOT_DIR, path)

    before(() => {
      fs.ensureDirSync(dir('one/two/three/node_modules/react'));
      fs.ensureDirSync(dir('one/node_modules/react'));
      fs.ensureDirSync(dir('one/node_modules/string'));
    });
    after(() => {
      fs.removeSync(ROOT_DIR);
    });

    it('retrieves `/one/two/three/node_modules/react`', () => {
      const FOLDER = dir('one/two/three');
      const result = paths.closestModulePath(FOLDER, 'react');
      expect(result).to.equal(dir('one/two/three/node_modules/react'));
    });

    it('retrieves `/one/node_modules/react` (walk up 1-level)', () => {
      const FOLDER = dir('one/two/');
      const result = paths.closestModulePath(FOLDER, 'react');
      expect(result).to.equal(dir('one/node_modules/react'));
    });

    it('retrieves `/one/node_modules/string` (walk up 2-levels)', () => {
      const FOLDER = dir('one/two/three');
      const result = paths.closestModulePath(FOLDER, 'string');
      expect(result).to.equal(dir('one/node_modules/string'));
    });

    it('does not find a match', () => {
      const FOLDER = dir('one/two/three');
      const result = paths.closestModulePath(FOLDER, 'not-exist');
      expect(result).to.equal(undefined);
    });
  });
});

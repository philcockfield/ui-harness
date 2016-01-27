import { expect } from 'chai';
import fsPath from 'path';
import * as yamlConfig from '../../src/server/yaml-config';


describe('YAML config (.uiharness)', function() {
  describe('parse', function() {
    it('throws if the YAML is invalid', () => {
      let fn = () => yamlConfig.parse(`foo: 123 bar:33::`);
      expect(fn).to.throw(/file is invalid/);
    });

    it('sets a default entry path', () => {
      const config = yamlConfig.parse("");
      expect(config.entry).to.equal(fsPath.resolve('./src/specs'));
    });

    it('changes the relative "entry" field to an absolute path', () => {
      const yaml = `
        entry: ./src/specs
      `;
      const config = yamlConfig.parse(yaml);
      expect(config.entry).to.equal(fsPath.resolve('./src/specs'));
    });

    it('uses the given absolute "entry" field', () => {
      const yaml = `
        entry: /foo/specs
      `;
      const config = yamlConfig.parse(yaml);
      expect(config.entry).to.equal('/foo/specs');
    });
  });


  describe('load', function() {
    it('return nothing if the file does not exist', () => {
      expect(yamlConfig.load('/does/not/exist.yml')).to.equal(undefined);
    });

    it('loads the specified file (relative)', () => {
      const config = yamlConfig.load('./test/server/sample.yml');
      expect(config.entry).to.equal(fsPath.resolve("./foo/specs"));
    });

    it('loads the specified file (absolute)', () => {
      const config = yamlConfig.load(fsPath.resolve('./test/server/sample.yml'));
      expect(config.entry).to.equal(fsPath.resolve("./foo/specs"));
    });

    it('loads the .uiharness from the root of the project (no path)', () => {
      expect(yamlConfig.load().entry).to.equal(fsPath.resolve("./src/specs"));
      expect(yamlConfig.load(null).entry).to.equal(fsPath.resolve("./src/specs"));
      expect(yamlConfig.load("").entry).to.equal(fsPath.resolve("./src/specs"));
      expect(yamlConfig.load("  ").entry).to.equal(fsPath.resolve("./src/specs"));
    });
  });


  describe.only('API: .uiharness.yml', function() {
    let config;
    beforeEach(() => {
      config = yamlConfig.load('./test/server/sample.yml');
    });

    describe('start', function() {
      it('has an "entry" path (relative => absolute)', () => {
        expect(config.entry).to.equal(fsPath.resolve("./foo/specs"));
      });

      it('has a "port"', () => {
        expect(config.port).to.equal(1234);
      });

      it('has a "proxy"', () => {
        expect(config.proxy).to.eql({ '/graphql': 'http://localhost:8080' });
      });

      it('has a "graphqlSchema" path (relative => absolute)', () => {
        expect(config.graphqlSchema).to.equal(fsPath.resolve('./data/schema.js'));
      });
    });
  });
});

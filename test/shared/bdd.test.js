import { expect } from "chai";
import sinon from "sinon";
import bdd from "../../src/shared/bdd";
import jsBdd from "js-bdd";
import ThisContext from "../../src/shared/ThisContext";
const BDD = ['describe', 'it', 'before', 'beforeEach', 'after', 'afterEach', 'section'];



describe("BDD", () => {
  const ORIGINAL_DSL = {}
  beforeEach(() => {
    BDD.forEach(methodName => { ORIGINAL_DSL[methodName] = global[methodName] });
  });
  afterEach(() => {
    BDD.forEach(methodName => { global[methodName] = ORIGINAL_DSL[methodName] });
    jsBdd.reset();
  });



  it("registers the DSL in the global namespace", () => {
    bdd.register();
    bdd.supportedMethods.forEach(methodName => {
      expect(global[methodName]).to.equal(jsBdd[methodName]);
    });
  });


  it("unregisters the DSL", () => {
    bdd.register();
    bdd.unregister();
    bdd.supportedMethods.forEach(methodName => {
      expect(global[methodName]).to.equal(ORIGINAL_DSL[methodName]);
    });
  });


  it("exposes the object containing all suites", () => {
    expect(bdd.suites).to.equal(jsBdd.allSuites);
  });



  describe("rootSuites()", () => {
    beforeEach(() => { bdd.register(); });

    it("gets root set of suites (no child suites)", () => {
      let suite = describe("foo", () => {
        describe("bar", () => { });
      });
      expect(bdd.rootSuites()).to.eql([ suite ]);
    });


    it("includes a sub-set of [.only] suites", () => {
      describe("suite-1", () => {
        describe.only("suite-1.1", () => { });
      });
      describe("suite-2", () => {
        describe("suite-2.2", () => { });
      });
      expect(bdd.rootSuites().length).to.equal(1);
      expect(bdd.rootSuites()[0].name).to.equal("suite-1");
    });


    it("does not include skipped suites", () => {
      describe.skip("suite-1", () => { });
      describe("suite-2", () => { });
      expect(bdd.rootSuites().length).to.equal(1);
      expect(bdd.rootSuites()[0].name).to.equal("suite-2");
    });
  });


  describe("[this] context", () => {
    let self;
    beforeEach(() => {
      self = null;
      bdd.register();
    });

    it("stores the context on the suite", () => {
      let self1, self2
      describe("suite-1", function(){ self1 = this; });
      describe("suite-2", function(){ self2 = this; });
      expect(self1.suite.meta.thisContext).to.equal(self1);
      expect(self2.suite.meta.thisContext).to.equal(self2);
      expect(self1).not.to.equal(self2);
    });

    it("within [describe]", () => {
      describe("Foo", function(){ self = this; });
      expect(self).to.be.an.instanceof(ThisContext);
      expect(self.suite.meta.thisContext).to.equal(self);
    });

    it("within [section]", () => {
      describe("Foo", function(){
        section("my section", function(){ self = this; })
      });
      expect(self).to.be.an.instanceof(ThisContext);
    });

    it("within [before]", () => {
      let suite;
      suite = describe("Foo", function(){
        before(function() { self = this; })
      });
      suite.beforeHandlers.invoke(new ThisContext());
      expect(self).to.be.an.instanceof(ThisContext);
    });

    it("within [it]", () => {
      let spec;
      describe("Foo", function(){
        spec = it("does something", function(){ self = this; })
      });
      spec.invoke(new ThisContext());
      expect(self).to.be.an.instanceof(ThisContext);
    });
  });
});

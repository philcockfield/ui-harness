import { expect } from "chai";
import ThisContext from "../../src/shared/ThisContext";
import bdd from "../../src/shared/bdd";
import api from "../../src/shared/api";


describe("ThisContext", () => {
  describe("properties", () => {
    let suite, context;
    afterEach(() => {
      bdd.reset();
    });
    beforeEach(() => {
      bdd.register();
      suite = describe(`My Suite`, () => { });
      context = suite.meta.thisContext;
    });


    describe.skip("title", () => {
      it("returns the name of the suite by default", () => {
        expect(context.title()).to.equal("My Suite");
      });

      it("returns the [self] context when writing", () => {
        expect(context.title("Foo")).to.equal(context);
      });

      it("returns the written name", () => {
        context.title("Foo");
        expect(context.title()).to.equal("Foo");
      });
    });


    it.skip("title AND subtitle (chaining)", () => {
      expect(context.subtitle()).to.equal(undefined);
      context.title("my-title").subtitle("my-subtitle");
      expect(context.title()).to.equal("my-title");
      expect(context.subtitle()).to.equal("my-subtitle");
    });
  });
});

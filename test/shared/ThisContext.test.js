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



    describe("cropMarks()", () => {
      it("has crop-marks by default", () => {
        expect(context.cropMarks()).to.equal(true);
        expect(context.cropMarks.size()).to.equal(20);
        expect(context.cropMarks.offset()).to.equal(5);
      });

      it("stores crop-marks value", () => {
        context.cropMarks(true).cropMarks(false);
        expect(context.cropMarks()).to.equal(false);
      });

      it("stores extensions (size/offset)", () => {
        context
          .cropMarks.size(50)
          .cropMarks.offset(0);
        expect(context.cropMarks.size()).to.equal(50);
        expect(context.cropMarks.offset()).to.equal(0);
      });
    });
  });
});

import { expect } from "chai";
import ThisContext from "../../src/shared/ThisContext";
import bdd from "../../src/shared/bdd";
import api from "../../src/shared/api-internal";


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


    describe("size (width/height)", function() {
      it("has not width/height by default ('auto')", () => {
        expect(context.width()).to.equal("auto");
        expect(context.height()).to.equal("auto");
      });

      it("stores width/height (number)", () => {
        context
          .width(250)
          .height(120)
        expect(context.width()).to.equal(250);
        expect(context.height()).to.equal(120);
      });

      it("resets with `null`", () => {
        context.width(250).height(120)
        context.width(null).height(null)
        expect(context.width()).to.equal("auto");
        expect(context.height()).to.equal("auto");
      });
    });
  });
});

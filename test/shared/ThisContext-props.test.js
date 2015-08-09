import _ from "lodash";
import { expect } from "chai";
import ThisContext from "../../src/shared/ThisContext";
import bdd from "../../src/shared/bdd";
import api from "../../src/shared/api-internal";


describe.only("ThisContext", () => {
  let suite, context;
  afterEach(() => { bdd.reset(); })
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

    it("throws on invalid values", () => {
      expect(() => { context.cropMarks(123) }).to.throw();
      expect(() => { context.cropMarks.size(true) }).to.throw();
      expect(() => { context.cropMarks.offset(true) }).to.throw();
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

    it("width throws if a number of string is not passed", () => {
      let fn = () => {
        context
          .width(250)
          .width("100%")
          .width({ foo: 123 })
      };
      expect(fn).to.throw();
    });

    it("height throws if a number of string is not passed", () => {
      let fn = () => {
        context
          .height(250)
          .height("100%")
          .height({ foo: 123 })
      };
      expect(fn).to.throw();
    });
  });


  describe("margin", function() {
    it("it has a default value", () => {
      expect(_.isNumber(context.margin())).to.equal(true);
    });

    it("stores values", () => {
      expect(context.margin(10).margin()).to.equal(10);
    });

    it("throws if a number of string is not passed", () => {
      expect(() => { context.margin({}) }).to.throw();
    });
  });


  describe("align", function() {
    it("has a default value", () => {
      expect(context.align()).to.equal("center top");
    });

    it("throws if a string is not specified", () => {
      expect(() => { context.margin(false) }).to.throw();
    });
  });


  describe("header", function() {
    it("is undefined by default", () => {
      expect(context.header()).to.equal(undefined);
    });

    it("can be set to null", () => {
      context.header(null);
      expect(context.header()).to.equal(null);
    });

    it("throws if a string is not specified", () => {
      expect(() => { context.margin(false) }).to.throw();
    });
  });
});

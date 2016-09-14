import R from 'ramda';
import { expect } from 'chai';
import { PropTypes } from 'react-schema';

import api from '../../src/shared/api-internal';
import bdd from '../../src/shared/bdd';

describe('ThisContext', () => {
  let suite;
  let context;
  afterEach(() => { bdd.reset(); });
  beforeEach(() => {
    bdd.register();
    suite = describe(`My Suite`, () => {});
    api.setCurrent({ suite });
    context = suite.meta.thisContext;
  });


  describe('cropMarks()', () => {
    it('has crop-marks by default', () => {
      expect(context.cropMarks()).to.equal(true);
      expect(context.cropMarks.size()).to.equal(25);
      expect(context.cropMarks.offset()).to.equal(5);
    });

    it('stores crop-marks value', () => {
      context.cropMarks(true).cropMarks(false);
      expect(context.cropMarks()).to.equal(false);
    });

    it('persists to the [current] map', () => {
      context
        .cropMarks(true)
        .cropMarks.size(50)
        .cropMarks.offset(0);
      expect(api.current.get('cropMarks')).to.equal(true);
      expect(api.current.get('cropMarks.size')).to.equal(50);
      expect(api.current.get('cropMarks.offset')).to.equal(0);
    });

    it('stores extensions (size/offset)', () => {
      context
        .cropMarks.size(50)
        .cropMarks.offset(0);
      expect(context.cropMarks.size()).to.equal(50);
      expect(context.cropMarks.offset()).to.equal(0);
    });
  });


  describe('size (width/height)', function() {
    it('has not width/height by default ("auto")', () => {
      expect(context.width()).to.equal('auto');
      expect(context.height()).to.equal('auto');
    });

    it('stores width/height (number)', () => {
      context
        .width(250)
        .height(120);
      expect(context.width()).to.equal(250);
      expect(context.height()).to.equal(120);
    });

    it('resets with `null`', () => {
      context.width(250).height(120);
      context.width(null).height(null);
      expect(context.width()).to.equal('auto');
      expect(context.height()).to.equal('auto');
    });
  });


  describe('margin', function () {
    it('it has a default value', () => {
      expect(R.is(Number, context.margin())).to.equal(true);
    });

    it('stores values', () => {
      expect(context.margin(10).margin()).to.equal(10);
    });
  });



  describe('align', function () {
    it('has a default value', () => {
      expect(context.align()).to.equal('center top');
    });

    it('takes a value', () => {
      expect(context.align('center middle').align()).to.equal('center middle');
    });
  });


  describe('header', function () {
    it('is undefined by default', () => {
      expect(context.header()).to.equal(undefined);
    });

    it('can be set to null', () => {
      context.header(null);
      expect(context.header()).to.equal(null);
    });
  });


  describe('header.hr', function() {
    it('is [undefined] by default', () => {
      expect(context.hr()).to.equal(true);
    });

    it('can be set to true', () => {
      context.header('## My subtitle').hr(true);
      expect(context.hr()).to.equal(true);
    });
  });


  describe('backdrop', function () {
    it('has default value', () => {
      expect(context.backdrop()).to.equal(0);
    });

    it('clamps number values between -1..1', () => {
      expect(context.backdrop(2).backdrop()).to.equal(1);
      expect(context.backdrop(1.1).backdrop()).to.equal(1);
      expect(context.backdrop(1).backdrop()).to.equal(1);
      expect(context.backdrop(0).backdrop()).to.equal(0);
      expect(context.backdrop(-1).backdrop()).to.equal(0);
    });
  });



  describe('background', function() {
    it('does not have a background by default', () => {
      expect(context.background()).to.equal(undefined);
    });

    it('stores a background value', () => {
      expect(context.background('red').background()).to.equal('red');
      expect(context.background(0.5).background()).to.equal(0.5);
    });

    it('clamps number values between -1..1', () => {
      expect(context.background(2).background()).to.equal(1);
      expect(context.background(1.1).background()).to.equal(1);
      expect(context.background(1).background()).to.equal(1);
      expect(context.background(0).background()).to.equal(0);
      expect(context.background(-1).background()).to.equal(0);
    });
  });


  describe('scroll', function() {
    it('is not scrolling by default', () => {
      expect(context.scroll()).to.equal(false);
    });

    it('can be x, y or x:y', () => {
      expect(context.scroll('x').scroll()).to.equal('x');
      expect(context.scroll('y').scroll()).to.equal('y');
      expect(context.scroll('x:y').scroll()).to.equal('x:y');
    });

    it('can be true/false', () => {
      expect(context.scroll(false).scroll()).to.equal(false);
      expect(context.scroll(true).scroll()).to.equal(true);
    });
  });



  describe('context', function() {
    it('has no context by default', () => {
      expect(context.context()).to.equal(undefined);
    });

    it('stores the given object', () => {
      const myContext = {
        getState: () => true,
        dispatch: () => true,
        subscribe: () => true,
      };
      expect(context
        .childContextTypes({
          getState: PropTypes.func,
          dispatch: PropTypes.func,
          subscribe: PropTypes.func,
        })
        .context(myContext)
        .context()
      ).to.deep.equal(myContext);
    });

    it('is chainable', () => {
      const result = context
        .childContextTypes({ foo: PropTypes.object })
        .context({ foo: 123 })
        ;
      expect(result).to.equal(context);
    });
  });
});

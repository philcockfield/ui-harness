import R from 'ramda';
import { expect } from 'chai';
import ThisContext from '../../src/shared/ThisContext';
import bdd from '../../src/shared/bdd';
import api from '../../src/shared/api-internal';


describe('ThisContext.page', function() {
  let suite, context;
  afterEach(() => { bdd.reset(); })
  beforeEach(() => {
    bdd.register();
    suite = describe(`My Suite`, () => { });
    api.setCurrent({ suite: suite });
    context = suite.meta.thisContext;
  });



  describe('page', function() {
    it('has a page object', () => {
      expect(context.page).to.be.an.instanceof(Object);
    });

    it('has an `insert` method', () => {
      expect(context.page.insert).to.be.an.instanceof(Function);
    });

    it('has an `insertLink` method', () => {
      expect(context.page.insertLink).to.be.an.instanceof(Function);
    });

    it('has an `insertFont` method', () => {
      expect(context.page.insertFont).to.be.an.instanceof(Function);
    });

  });
});

import R from 'ramda';
import { expect } from 'chai';
import ThisContext from '../../src/shared/ThisContext';
import bdd from '../../src/shared/bdd';
import api from '../../src/shared/api-internal';


describe('ThisContext.page', function() {
  let suite, context, page;
  afterEach(() => { bdd.reset(); })
  beforeEach(() => {
    bdd.register();
    suite = describe(`My Suite`, () => { });
    api.setCurrent({ suite: suite });
    context = suite.meta.thisContext;
    page = context.page;
  });



  describe('page', function() {
    it('has a page object', () => {
      expect(page).to.be.an.instanceof(Object);
    });

    it('has an `insert` method', () => {
      const result = page.insert(null, "link", {});
      expect(result).to.equal(context);
    });

    it('has an `insertLink` method', () => {
      const result = page.insertLink({});
      expect(result).to.equal(context);
    });

    it('has an `insertFont` method', () => {
      const result = page.insertFont('https://fonts.googleapis.com/css?family=Lato:200,900');
      expect(result).to.equal(context);
    });
  });
});

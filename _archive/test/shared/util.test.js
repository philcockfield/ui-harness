import { expect } from 'chai';
import * as util from '../../src/shared/util';


describe('util.formatText', () => {
  it('returns nothing', () => {
    expect(util.formatText()).to.equal(undefined);
    expect(util.formatText(null)).to.equal(null);
    expect(util.formatText('')).to.equal('');
  });
});

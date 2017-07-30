import { expect } from 'chai';
import { transformStyle } from '../css';


describe('React: CSS', () => {
  it('is a function', () => {
    expect(transformStyle).to.be.an.instanceof(Function);
  });

  it('returns the given object', () => {
    const style = { color: 'red' };
    expect(transformStyle(style)).to.equal(style);
  });

  it('returns an empty object if no `style` parameter is given', () => {
    expect(transformStyle()).to.eql({});
  });

  it('removes undefined values', () => {
    const style = { color: undefined, background: null };
    expect(transformStyle(style)).to.eql({});
  });

});

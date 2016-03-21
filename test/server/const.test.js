import { expect } from 'chai';
import server from '../../src/server';


describe('__UIHARNESS__ flag', function() {
  it('is not set prior to being started', () => {
    expect(__UIHARNESS__).to.equal(false);
  });
});

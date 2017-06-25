import { expect } from 'chai';
import bdd from '../../src/shared/bdd';
import bddServer from '../../src/shared/bdd-server';


describe('it.server', function() {
  beforeEach(() => { bdd.register(); });
  afterEach(() => { bdd.reset(); });


  it('registers the `it.server` extension', () => {
    expect(it.server).to.be.an.instanceof(Function);
  });


  it('stores details on the spec', () => {
    let spec;
    describe('suite', () => {
      spec = it.server('does something', (text, number) => {});
    });
    expect(spec.isServer).to.equal(true);
    expect(spec.params).to.eql(['text', 'number']);
  });
});

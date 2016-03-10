import React from 'react';
import { expect } from 'chai';

import api from '../../src/shared/api-internal';
import bdd from '../../src/shared/bdd';
import ThisContext from '../../src/shared/ThisContext';

class Foo extends React.Component {
  render() {
    return React.createElement('div', this.props, this.props.children);
  }
}



describe('ThisContext: load', () => {
  let self;
  before(() => {
    bdd.reset();
    bdd.register();
  });

  beforeEach(() => {
    api.reset({ hard: true });
    self = new ThisContext();
  });


  it('returns an instance of the [self] context', () => {
    expect(self.component(Foo)).to.equal(self);
  });


  describe('Storing Type, Props and Children on the [current] state', () => {
    it('from individual args', () => {
      self
        .props({ text: 'hello' })
        .children('child')
        .component(Foo);
      expect(api.current.get('componentType')).to.equal(Foo);
      expect(api.current.get('componentProps')).to.eql({ text: 'hello' });
      expect(api.current.get('componentChildren')).to.equal('child');
    });

    it('from element', () => {
      let foo = React.createElement(Foo, { text: 'hello' }, 'child');
      self.component(foo);
      expect(api.current.get('componentType')).to.equal(Foo);
      expect(api.current.get('componentProps')).to.eql({ text: 'hello' });
      expect(api.current.get('componentChildren')).to.equal('child');
    });
  });

  it('allows props to be set after the component has loaded', () => {
    self
      .component(Foo)
      .props({ a: 1 });
    expect(api.current.get('componentProps')).to.eql({ a: 1 });
  });

  it('merges prop into current props', () => {
    self
      .props({ a: 1 })
      .props({ b: 2 })
      .component(Foo);
    expect(api.current.get('componentProps')).to.eql({ a: 1, b: 2 });
  });
});

import React from 'react';
import Foo from 'react-atoms/components/Foo';


describe('OutputLog', function() {
  this.header(`## A tailing output log.`)

  before(() => {
    this
      .width(300)
      // .load( <Foo>Foo</Foo> );
      .log('foo')
      .log('foo1', 'bar')
      // .log('foo2')
  });

  it('`load(<Foo/>)`', () => this.load( <Foo>Foo</Foo> ));

  section('log', () => {
    it('`log()`', () => this.log());
    it('`log(123)`', () => { this.log(123); });
    it('`log(123, "four")`', () => { this.log(123, 'four'); });
  });
  it('`log.clear()`', () => this.log.clear());
});

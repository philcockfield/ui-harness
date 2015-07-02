'use strict'
var { expect } = require('chai')

import * as file from './file'



describe('hello', () => {

  it('imports', () => {
    console.log('file', file);
  });


  it('does loops', () => {
    let array = [1,2,3];

    let mapped = array.map((item) => item + 10);
    array.forEach((item) => {
      console.log('item', item);
    });
  });


  it('iterate keys', () => {
    let foo = {abc:123, foo(){}};
    Object.keys(foo).forEach((key) => console.log('key > ', key));
  });


  it('symbols', () => {
    let key1 = Symbol('foo');
    let key2 = Symbol('foo');
    expect(key1).not.to.eql(key2);

    let obj = {};

    obj[key1] = 123
    obj[key2] = 'abc'

    console.log('obj', obj);




  });

});

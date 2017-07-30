import { expect } from 'chai';
import { value } from '.';



describe('isPlainObject', () => {
  it('is a plain object', () => {
    expect(value.isPlainObject(Object.create({}))).to.equal(true);
    expect(value.isPlainObject(Object.create(Object.prototype))).to.equal(true);
    expect(value.isPlainObject({ foo: 123 })).to.equal(true);
    expect(value.isPlainObject({})).to.equal(true);
  });


  it('is not a plain object', () => {
    class Foo { }
    expect(value.isPlainObject(1)).to.equal(false);
    expect(value.isPlainObject([ 'foo', 'bar' ])).to.equal(false);
    expect(value.isPlainObject([])).to.equal(false);
    expect(value.isPlainObject(new Foo())).to.equal(false);
    expect(value.isPlainObject(null)).to.equal(false);
    expect(value.isPlainObject(Object.create(null))).to.equal(false);
  });
});



// ----------------------------------------------------------------------------



describe('compact', () => {
  it('makes no change', () => {
    expect(value.compact([ 1, 2, 3 ])).to.eql([ 1, 2, 3 ]);
  });

  it('removes null values', () => {
    expect(value.compact([ 1, null, 3, null ])).to.eql([ 1, 3 ]);
  });

  it('removes undefined values', () => {
    expect(value.compact([ 1, undefined, 3, undefined ])).to.eql([ 1, 3 ]);
  });

  it('removes empty strings', () => {
    expect(value.compact([ 1, '', 3 ])).to.eql([ 1, 3 ]);
  });

  it('retains `false` and 0', () => {
    expect(value.compact([ 0, 1, false, 3 ])).to.eql([ 0, 1, false, 3 ]);
  });

  it('retains white space strings', () => {
    expect(value.compact([ 0, 1, ' ', 3 ])).to.eql([ 0, 1, ' ', 3 ]);
  });
});



// -----------------------------------------------------------------------------



describe('value.isBlank', () => {
  describe('blank', () => {
    it('is blank (nothing)', () => {
      expect(value.isBlank(undefined)).to.equal(true);
      expect(value.isBlank(null)).to.equal(true);
    });

    it('is blank (string)', () => {
      expect(value.isBlank('')).to.equal(true);
      expect(value.isBlank(' ')).to.equal(true);
      expect(value.isBlank('   ')).to.equal(true);
    });

    it('is blank (array)', () => {
      expect(value.isBlank([])).to.equal(true);
      expect(value.isBlank([ null ])).to.equal(true);
      expect(value.isBlank([ undefined ])).to.equal(true);
      expect(value.isBlank([ undefined, null ])).to.equal(true);
      expect(value.isBlank([ undefined, null, '' ])).to.equal(true);
    });
  });

  describe('NOT blank', () => {
    it('is not blank (string)', () => {
      expect(value.isBlank('a')).to.equal(false);
      expect(value.isBlank('   .')).to.equal(false);
    });

    it('is not blank (array)', () => {
      expect(value.isBlank([ 1 ])).to.equal(false);
      expect(value.isBlank([ null, 'value' ])).to.equal(false);
      expect(value.isBlank([ null, '   ' ])).to.equal(false);
    });

    it('is not blank (other values)', () => {
      expect(value.isBlank(1)).to.equal(false);
      expect(value.isBlank({})).to.equal(false);
      expect(value.isBlank(() => 0)).to.equal(false);
    });
  });
});


// ----------------------------------------------------------------------------


describe('value.isNumeric', () => {
  it('is numeric (number)', () => {
    expect(value.isNumeric(0)).to.equal(true);
    expect(value.isNumeric(1)).to.equal(true);
    expect(value.isNumeric(-1)).to.equal(true);
    expect(value.isNumeric(0.5)).to.equal(true);
    expect(value.isNumeric(123456.123456)).to.equal(true);
  });

  it('is numeric (string)', () => {
    expect(value.isNumeric('0')).to.equal(true);
    expect(value.isNumeric('1')).to.equal(true);
    expect(value.isNumeric('-1')).to.equal(true);
    expect(value.isNumeric('0.5')).to.equal(true);
    expect(value.isNumeric('123456.123456')).to.equal(true);
  });

  it('is not numeric', () => {
    expect(value.isNumeric(null)).to.equal(false);
    expect(value.isNumeric(undefined)).to.equal(false);
    expect(value.isNumeric('string')).to.equal(false);
    expect(value.isNumeric('123px')).to.equal(false);
    expect(value.isNumeric({})).to.equal(false);
    expect(value.isNumeric(new Date())).to.equal(false);
  });
});


// ----------------------------------------------------------------------------


describe('value.toNumber', () => {
  it('returns the non-number value', () => {
    const NOW = new Date();
    const OBJECT = { foo: 123 };
    expect(value.toNumber('hello')).to.equal('hello');
    expect(value.toNumber(OBJECT)).to.equal(OBJECT);
    expect(value.toNumber(NOW)).to.equal(NOW);
    expect(value.toNumber(null)).to.equal(null);
    expect(value.toNumber(undefined)).to.equal(undefined);
  });

  it('converts a string to a number', () => {
    expect(value.toNumber('0')).to.equal(0);
    expect(value.toNumber('-1')).to.equal(-1);
    expect(value.toNumber('1')).to.equal(1);
    expect(value.toNumber('12.34')).to.equal(12.34);
  });

  it('does not convert a number/unit string toa number', () => {
    expect(value.toNumber('10px')).to.equal('10px');
  });
});


// ----------------------------------------------------------------------------


describe('value.toBool', () => {
  describe('existing Boolean value', () => {
    it('true (no change)', () => {
      expect(value.toBool(true)).to.equal(true);
    });

    it('false (no change)', () => {
      expect(value.toBool(false)).to.equal(false);
    });
  });

  describe('string to Boolean', () => {
    it('converts `true` (string) to true', () => {
      expect(value.toBool('true')).to.equal(true);
      expect(value.toBool('True')).to.equal(true);
      expect(value.toBool('   truE   ')).to.equal(true);
    });

    it('converts `false` (string) to false', () => {
      expect(value.toBool('false')).to.equal(false);
      expect(value.toBool('False')).to.equal(false);
      expect(value.toBool('   falSe   ')).to.equal(false);
    });
  });

  it('does not convert other value types', () => {
    expect(value.toBool(undefined)).to.equal(undefined);
    expect(value.toBool(null)).to.equal(undefined);
    expect(value.toBool('Foo')).to.equal(undefined);
    expect(value.toBool('')).to.equal(undefined);
    expect(value.toBool(' ')).to.equal(undefined);
    expect(value.toBool(123)).to.equal(undefined);
    expect(value.toBool({ foo: 123 })).to.eql(undefined);
  });

  it('returns the given default value', () => {
    expect(value.toBool(undefined, true)).to.equal(true);
    expect(value.toBool(undefined, false)).to.equal(false);
    expect(value.toBool(undefined, 123)).to.equal(123);

    expect(value.toBool(null, true)).to.equal(true);
    expect(value.toBool(null, false)).to.equal(false);
    expect(value.toBool(null, 123)).to.equal(123);
  });
});



// ----------------------------------------------------------------------------


describe('toType', () => {
  it('converts to bool (true)', () => {
    expect(value.toType('true')).to.equal(true);
    expect(value.toType(' true  ')).to.equal(true);
    expect(value.toType('True')).to.equal(true);
    expect(value.toType('TRUE')).to.equal(true);
  });

  it('converts to bool (false)', () => {
    expect(value.toType('false')).to.equal(false);
    expect(value.toType(' false  ')).to.equal(false);
    expect(value.toType('False')).to.equal(false);
    expect(value.toType('FALSE')).to.equal(false);
  });

  it('converts to number', () => {
    expect(value.toType('123')).to.equal(123);
    expect(value.toType(' -123  ')).to.equal(-123);
    expect(value.toType('0')).to.equal(0);
    expect(value.toType('0.0001')).to.equal(0.0001);
  });

  it('converts does not convert', () => {
    const now = new Date();
    expect(value.toType('foo')).to.eql('foo');
    expect(value.toType(undefined)).to.eql(undefined);
    expect(value.toType(null)).to.eql(null);
    expect(value.toType({})).to.eql({});
    expect(value.toType(now)).to.eql(now);
    expect(value.toType(123)).to.eql(123);
  });
});


// ----------------------------------------------------------------------------


describe('round', () => {
  it('rounds to 0 decimal places', () => {
    expect(value.round(1.123)).to.equal(1);
    expect(value.round(1.513)).to.equal(2);
  });

  it('rounds to 1 decimal place', () => {
    expect(value.round(1.123, 1)).to.equal(1.1);
    expect(value.round(1.153, 1)).to.equal(1.2);
  });

  it('rounds to 2 decimal places', () => {
    expect(value.round(1.123, 2)).to.equal(1.12);
    expect(value.round(1.156, 2)).to.equal(1.16);
  });

  it('rounds to 3 decimal places', () => {
    expect(value.round(1.123, 3)).to.equal(1.123);
    expect(value.round(1.156, 3)).to.equal(1.156);
  });
});


// ----------------------------------------------------------------------------


describe('isPromise', () => {
  const myThing = () => {
    return new Promise((resolve, reject) => {
      resolve();
    });
  };

  it('is a promise', () => {
    const promise = myThing();
    expect(value.isPromise(promise)).to.equal(true);
  });

  it('is not a promise', () => {
    expect(value.isPromise()).to.equal(false);
    expect(value.isPromise(null)).to.equal(false);
    expect(value.isPromise(123)).to.equal(false);
    expect(value.isPromise({ then: 123 })).to.equal(false);
  });
});


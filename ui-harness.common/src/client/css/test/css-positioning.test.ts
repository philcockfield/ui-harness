import { expect } from 'chai';
import { transformStyle, toPositionEdges } from '../css';


describe('React: transformStyle - positioning', () => {
  describe('converting from transformStyle - function', () => {
    it('converts an `Absolute` value (deep)', () => {
      const style = transformStyle({ Absolute: '10 20em 30px 40' }) as any;
      expect(style.position).to.equal('absolute');
      expect(style.top).to.equal(10);
      expect(style.right).to.equal('20em');
      expect(style.bottom).to.equal('30px');
      expect(style.left).to.equal(40);
    });


    it('converts a `Fixed` value', () => {
      const style = transformStyle({ Fixed: '10 20em 30px 40' }) as any;
      expect(style.position).to.equal('fixed');
      expect(style.top).to.equal(10);
      expect(style.right).to.equal('20em');
      expect(style.bottom).to.equal('30px');
      expect(style.left).to.equal(40);
    });

    it('converts array value (with null\'s)', () => {
      const style = transformStyle({ Absolute: ['10', null, '30px', '40'] }) as any;
      expect(style.position).to.equal('absolute');
      expect(style.top).to.equal(10);
      expect(style.right).to.equal(undefined);
      expect(style.bottom).to.equal('30px');
      expect(style.left).to.equal(40);
    });

    it('does nothing with an [undefined] value', () => {
      expect(transformStyle({ Absolute: undefined })).to.eql({});
    });

    it('does nothing with an [empty-string] value', () => {
      expect(transformStyle({ Absolute: '' })).to.eql({});
    });
  });


  describe('AbsoluteCenter', function() {
    it('converts `x`', () => {
      const style = transformStyle({ AbsoluteCenter: 'x' }) as any;
      expect(style.position).to.equal('absolute');
      expect(style.left).to.equal('50%');
      expect(style.top).to.equal(undefined);
      expect(style.transform).to.equal('translateX(-50%)');
    });

    it('converts `y`', () => {
      const style = transformStyle({ AbsoluteCenter: 'y' }) as any;
      expect(style.position).to.equal('absolute');
      expect(style.left).to.equal(undefined);
      expect(style.top).to.equal('50%');
      expect(style.transform).to.equal('translateY(-50%)');
    });

    it('converts `xy`', () => {
      const style = transformStyle({ AbsoluteCenter: 'xy' }) as any;
      expect(style.position).to.equal('absolute');
      expect(style.left).to.equal('50%');
      expect(style.top).to.equal('50%');
      expect(style.transform).to.equal('translate(-50%, -50%)');
    });

    it('retains top value (x)', () => {
      const style = transformStyle({ left: 0, top: 0, AbsoluteCenter: 'x' }) as any;
      expect(style.position).to.equal('absolute');
      expect(style.left).to.equal('50%');
      expect(style.top).to.equal(0);
      expect(style.transform).to.equal('translateX(-50%)');
    });

    it('retains left value (y)', () => {
      const style = transformStyle({ left: 0, top: 0, AbsoluteCenter: 'y' }) as any;
      expect(style.position).to.equal('absolute');
      expect(style.left).to.equal(0);
      expect(style.top).to.equal('50%');
      expect(style.transform).to.equal('translateY(-50%)');
    });
  });


  describe('toPositionEdges', () => {
    it('all edges from string', () => {
      const style = toPositionEdges('Absolute', '10 20 30em 40') as any;
      expect(style.position).to.equal('absolute');
      expect(style.top).to.equal(10);
      expect(style.right).to.equal(20);
      expect(style.bottom).to.equal('30em');
      expect(style.left).to.equal(40);
    });

    it('string containing `null`', () => {
      const style = toPositionEdges('Absolute', '10 null 30em null') as any;
      expect(style.top).to.equal(10);
      expect(style.right).to.equal(undefined);
      expect(style.bottom).to.equal('30em');
      expect(style.left).to.equal(undefined);
    });


    describe('array', () => {
      it('all edges', () => {
        const style = toPositionEdges('Absolute', ['10', '20', '30em', '40']) as any;
        expect(style.top).to.equal(10);
        expect(style.right).to.equal(20);
        expect(style.bottom).to.equal('30em');
        expect(style.left).to.equal(40);
      });

      it('all edges (0)', () => {
        const style = toPositionEdges('Absolute', [0, 0, 0, 0]) as any;
        expect(style.top).to.equal(0);
        expect(style.right).to.equal(0);
        expect(style.bottom).to.equal(0);
        expect(style.left).to.equal(0);
      });

      it('empty array', () => {
        const style = toPositionEdges('Absolute', []) as any;
        expect(style).to.equal(undefined);
      });

      it('single value array [0]', () => {
        const style = toPositionEdges('Absolute', [0]) as any;
        expect(style.top).to.equal(0);
        expect(style.right).to.equal(0);
        expect(style.bottom).to.equal(0);
        expect(style.left).to.equal(0);
      });

      it('array containing `null` values', () => {
        const style = toPositionEdges('Absolute', [null, 10, null, null]) as any;
        expect(style.top).to.equal(undefined);
        expect(style.right).to.equal(10);
        expect(style.bottom).to.equal(undefined);
        expect(style.left).to.equal(undefined);
      });

      it('array containing all `null` values', () => {
        const style = toPositionEdges('Absolute', [null, null, null, null]) as any;
        expect(style).to.equal(undefined);
      });
    });

    describe('shorthand', () => {
      it('empty-string', () => {
        const style = toPositionEdges('Absolute', '') as any;
        expect(style).to.equal(undefined);
      });

      it('undefined', () => {
        const style = toPositionEdges('Absolute') as any;
        expect(style).to.equal(undefined);
      });

      it('1-value', () => {
        const style = toPositionEdges('Absolute', '10') as any;
        expect(style.top).to.equal(10);
        expect(style.right).to.equal(10);
        expect(style.bottom).to.equal(10);
        expect(style.left).to.equal(10);
      });

      it('1-value / Number', () => {
        const style = toPositionEdges('Absolute', 10) as any;
        expect(style.top).to.equal(10);
        expect(style.right).to.equal(10);
        expect(style.bottom).to.equal(10);
        expect(style.left).to.equal(10);
      });

      it('2-values', () => {
        const style = toPositionEdges('Absolute', '10 30em') as any;
        expect(style.top).to.equal(10);
        expect(style.right).to.equal('30em');
        expect(style.bottom).to.equal(10);
        expect(style.left).to.equal('30em');
      });

      it('3-values', () => {
        const style = toPositionEdges('Absolute', '10 30em 40') as any;
        expect(style.top).to.equal(10);
        expect(style.right).to.equal('30em');
        expect(style.left).to.equal('30em');
        expect(style.bottom).to.equal(40);
      });
    });
  });
});

import { expect } from 'chai';
import { transformStyle } from '../css';


describe('padding', function() {
  it('PaddingX', () => {
    const result = transformStyle({
      PaddingX: 14,
      paddingLeft: 1234, // Overwritten.
    }) as any;
    expect(result.paddingLeft).to.equal(14);
    expect(result.paddingRight).to.equal(14);
  });

  it('PaddingY', () => {
    const result = transformStyle({
      PaddingY: 20,
    }) as any;
    expect(result.paddingTop).to.equal(20);
    expect(result.paddingBottom).to.equal(20);
  });
});


describe('margin', function() {
  it('MarginX', () => {
    const result = transformStyle({
      MarginX: 14,
      marginLeft: 1234, // Overwritten.
    }) as any;
    expect(result.marginLeft).to.equal(14);
    expect(result.marginRight).to.equal(14);
  });

  it('MarginY', () => {
    const result = transformStyle({
      MarginY: 20,
    }) as any;
    expect(result.marginTop).to.equal(20);
    expect(result.marginBottom).to.equal(20);
  });
});


import { expect } from 'chai';
import { transformStyle } from '../css';



describe('Flex', () => {
  it('does not fail when undefined is passed', () => {
    const result = transformStyle({
      Flex: undefined,
    });
  });

  it('does not fail when false is passed', () => {
    const result = transformStyle({
      Flex: false,
    });
  });
});


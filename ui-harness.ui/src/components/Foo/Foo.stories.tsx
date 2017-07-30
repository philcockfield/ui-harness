import { React, describe } from '../../common/storybook';
import { Foo } from './Foo';


describe('primitives', {
  title: 'Sample component',
  width: 350,
  background: 'rgba(255, 0, 0, 0.1)', /* RED */
})
  .add('Foo', () => {
    return (
      <Foo />
    );
  });

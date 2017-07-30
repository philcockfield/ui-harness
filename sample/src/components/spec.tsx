import { describe } from '../common';


describe('root')
  .add('child', () => {
    return 'CHILD CONTENT';
  });


describe('root.foo');

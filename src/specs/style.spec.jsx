import * as React from 'react';

const MyComponent = () => {
  return (
    <div className='MyComponent'>MyComponent</div>
  );
};


const styles = {
  background: 'rgba(255, 0, 0, 0.1)',
  '.MyComponent': {
    position: 'relative',
    padding: 20,
    margin: 40,
    background: 'red',
    color: 'white',
  },
};


describe('style', function() {
  this.header(`## External style object`);
  before(() => {
    this
      .style(styles)
      .component( <MyComponent /> );
  });
});

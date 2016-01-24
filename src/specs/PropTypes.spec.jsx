import React from 'react';
import Foo from 'react-atoms/components/Foo';
import { css, PropTypes } from './util';



describe('PropTypes', function() {
  this.header(`## Renders a visual representation of the PropTypes API.`);

  before(() => {
    this.load( <MyComponent/> );
  });

  it('`unload`', () => this.unload());
  it('`load: <MyComponent>`', () => this.load( <MyComponent/> ));
  it('`load: <Foo>`', () => this.load( <Foo>Foo</Foo> ));
});


// ----------------------------------------------------------------------------


export default class MyComponent extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    obj: PropTypes.shape({
      color: PropTypes.string,
      isEnabled: PropTypes.bool
    })
  };
  static defaultProps = {
    obj: {
      color: 'tomato',
      isEnabled: true
    }
  };

  render() {
    return (
      <div>MyComponent</div>
    );
  }
}

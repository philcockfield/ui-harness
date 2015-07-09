import React from 'react';
import Radium from 'radium';


var styles = {
  base: {
    background: 'blue',
    border: 0,
    borderRadius: 4,
    color: 'white',
    padding: '1.5em',

    ':hover': {
      backgroundColor: 'red'
    },

    ':focus': {
      backgroundColor: 'green'
    },

    ':active': {
      backgroundColor: 'yellow'
    },
  },

  block: {
    display: 'block',

    ':hover': {
      boxShadow: '0 3px 0 rgba(0,0,0,0.2)'
    }
  },
};


/*
The root shell of the UIHarness.
*/
class Shell extends React.Component {
  render() {
    return (
    <button
      style={[
        styles.base,
        this.props.block && styles.block
      ]}>
      My Button

    </button>
    );
  }
}


export default Radium(Shell);

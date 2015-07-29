import React from "react";
import Radium from "radium";


const styles = {
  base: {
    background: "red"
  }
};


/*
The root shell of the UIHarness.
*/
@Radium
class UIHarness extends React.Component {
  render() {
    return (
      <div style={[ styles.base ]}>
        Start

      </div>
    );
  }
}


export default UIHarness;

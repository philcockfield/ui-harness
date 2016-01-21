import React from "react";
import Radium from "radium";
import Immutable from "immutable";
import Main from "./Main";
import IndexColumn from "./IndexColumn";
import { css, PropTypes } from "./util";
import GlobalStyles from "./GlobalStyles";

const COLUMN_MARGIN = 6;


/*
The root shell of the UIHarness.
*/
class UIHarness extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: this.props.current || Immutable.Map(),
      leftWidth: 250,
      rightWidth: 12
    };
  }


  styles() {
    let { leftWidth, rightWidth } = this.state;
    return css({
      base: {
        Absolute: 0,
        background: "#F5F5F5",
        boxSizing: "border-box"
      },
      column: {
        position: "relative",
        marginTop: COLUMN_MARGIN,
        marginBottom: COLUMN_MARGIN
      },
      left: {
        Absolute: [COLUMN_MARGIN, null, COLUMN_MARGIN, 0],
        width: leftWidth
      },
      main: {
        Absolute: [COLUMN_MARGIN, rightWidth, COLUMN_MARGIN, leftWidth],
      }
    });
  }


  render() {
    const styles = this.styles();
    let { current, leftWidth, rightWidth } = this.state;
    return (
      <div style={ styles.base }>
        <GlobalStyles/>

        <div style={[ styles.column, styles.left ]}>
          <IndexColumn current={ current } width={ leftWidth }/>
        </div>

        <div style={[ styles.column, styles.main ]}>
          <Main current={ current }/>
        </div>
      </div>
    );
  }
}



export default Radium(UIHarness);

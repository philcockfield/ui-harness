import React from "react";
import Radium from "radium";
import Immutable from "immutable";
import Main from "./Main";
import IndexColumn from "./IndexColumn";
import PropTypesColumn from "./PropTypesColumn";
import { css, PropTypes } from "js-util/react";

const COLUMN_MARGIN = 6;


/*
The root shell of the UIHarness.
*/
@Radium
export default class UIHarness extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: this.props.current || Immutable.Map(),
      leftWidth: 230,
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
      },
      right: {
        Absolute: [COLUMN_MARGIN, 0, COLUMN_MARGIN, null],
        width: rightWidth
      }
    });
  }


  render() {
    const styles = this.styles();
    let { current, leftWidth, rightWidth } = this.state;
    return (
      <div style={ styles.base }>
        <div style={[ styles.column, styles.left ]}>
          <IndexColumn current={ current } width={ leftWidth }/>
        </div>
        <div style={[ styles.column, styles.main ]}>
          <Main current={ current }/>
        </div>
        <div style={[ styles.column, styles.right ]}>
          <PropTypesColumn current={ current } width={ rightWidth }/>
        </div>
      </div>
    );
  }
}


// API -------------------------------------------------------------------------
UIHarness.propTypes = {};
UIHarness.defaultProps = {};

import React from "react";
import Radium from "radium";
import Immutable from "immutable";
import Main from "./column-main/Main";
import IndexColumn from "./column-index/IndexColumn";
import PropTypesColumn from "./column-props/PropTypesColumn";
import { css } from "js-util/react";

const COLUMN_MARGIN = 8;


/*
The root shell of the UIHarness.
*/
@Radium
export default class UIHarness extends React.Component {
  constructor(props) {
    super(props);
    this.state = { current: this.props.current || Immutable.Map() };
  }


  styles() {
    const LEFT_WIDTH = 250;
    const RIGHT_WIDTH = 250;

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
        width: LEFT_WIDTH
      },
      main: {
        Absolute: [COLUMN_MARGIN, RIGHT_WIDTH, COLUMN_MARGIN, LEFT_WIDTH],
      },
      right: {
        Absolute: [COLUMN_MARGIN, 0, COLUMN_MARGIN, null],
        width: RIGHT_WIDTH
      }
    });
  }


  render() {
    const styles = this.styles();
    let { current } = this.state;
    return (
      <div style={ styles.base }>
        <div style={[ styles.column, styles.left ]}>
          <IndexColumn current={ current }/>
        </div>
        <div style={[ styles.column, styles.main ]}>
          <Main current={ current }/>
        </div>
        <div style={[ styles.column, styles.right ]}>
          <PropTypesColumn current={ current }/>
        </div>
      </div>
    );
  }
}

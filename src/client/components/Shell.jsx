import React from "react";
import Radium from "radium";
import Main from "./column-main/Main";
import IndexColumn from "./column-index/IndexColumn";
import PropTypesColumn from "./column-props/PropTypesColumn";

const COLUMN_MARGIN = 6;


/*
The root shell of the UIHarness.
*/
@Radium
export default class UIHarness extends React.Component {
  styles() {
    return {
      base: {
        position: "absolute", left: 0, top: 0, right: 0, bottom: 0,
        background: "#F5F5F5",
        display: "flex",
        flexDirection: "row",
        boxSizing: "border-box"
      },
      column: {
        position: "relative",
        marginTop: COLUMN_MARGIN,
        marginBottom: COLUMN_MARGIN
      },
      left: {
        width: 330
      },
      main: {
        flex: "1 100%"
      },
      right: {
        width: 330,
        marginLeft: COLUMN_MARGIN,
        marginRight: COLUMN_MARGIN
      }
    };
  }


  render() {
    const styles = this.styles();
    return (
      <div style={ styles.base }>
        <div style={[ styles.column, styles.left ]}>
          <IndexColumn/>
        </div>
        <div style={[ styles.column, styles.main ]}>
          <Main/>
        </div>
        <div style={[ styles.column, styles.right ]}>
          <PropTypesColumn/>
        </div>
      </div>
    );
  }
}

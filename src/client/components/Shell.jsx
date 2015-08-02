import React from "react";
import Radium from "radium";
import Immutable from "immutable";
import Main from "./column-main/Main";
import IndexColumn from "./column-index/IndexColumn";
import PropTypesColumn from "./column-props/PropTypesColumn";

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


    return {
      base: {
        position: "absolute", left: 0, top: 0, right: 0, bottom: 0,
        background: "#F5F5F5",
        boxSizing: "border-box"
      },
      column: {
        position: "relative",
        marginTop: COLUMN_MARGIN,
        marginBottom: COLUMN_MARGIN
      },
      left: {
        position: "absolute",
        left: 0,
        top: COLUMN_MARGIN,
        bottom: COLUMN_MARGIN,
        width: LEFT_WIDTH
      },
      main: {
        position: "absolute",
        left: LEFT_WIDTH,
        top: COLUMN_MARGIN,
        right: RIGHT_WIDTH,
        bottom: COLUMN_MARGIN,
      },
      right: {
        position: "absolute",
        top: COLUMN_MARGIN,
        right: 0,
        bottom: COLUMN_MARGIN,
        width: RIGHT_WIDTH
      }
    };
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

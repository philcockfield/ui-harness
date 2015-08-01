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
        width: 330
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

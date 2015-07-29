import React from "react";
import Radium from "radium";
import Main from "./Main";

const EDGE_WIDTH = 320;


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
        boxSizing: 'border-box'
      },
      left: {
        width: EDGE_WIDTH
      },
      main: {
        flex: '1 100%',
        marginTop: 8,
        marginBottom: 16,
        position: 'relative'
      },
      right: {
        width: EDGE_WIDTH
      }
    };
  }


  render() {
    const styles = this.styles();
    return (
      <div style={ styles.base }>
        <div style={ styles.left }></div>
        <div style={ styles.main }>
          <Main/>
        </div>
        <div style={ styles.right }></div>
      </div>
    );
  }
}

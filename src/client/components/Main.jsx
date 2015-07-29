import React from "react";
import Radium from "radium";


/**
 * The Main (center) pane.
 */
 @Radium
export default class Main extends React.Component {

  style() {
    return {
      base: {
        background: 'white',
        position: "absolute", left: 0, top: 0, right: 0, bottom: 0,
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "rgba(0, 0, 0, 0.15)",
        borderRadius: 1,
        boxShadow: "0 0 8px 0px rgba(0, 0, 0, 0.1)",
      }
    };
  }

  render() {
    const style = this.style();
    return (
      <div style={ style.base }></div>
    );
  }
}


Main.propTypes = {};
Main.defaultProps = {};

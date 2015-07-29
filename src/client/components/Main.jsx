import React from "react";
import Radium from "radium";
import Card from "./Card";


/**
 * The Main (center) pane.
 */
 @Radium
export default class Main extends React.Component {

  style() {
    return {
      base: {}
    };
  }

  render() {
    const style = this.style();
    return (
      <Card>Main</Card>
    );
  }
}


Main.propTypes = {};
Main.defaultProps = {};

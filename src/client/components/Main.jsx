import React from "react";
import Radium from "radium";
import Card from "./Card";
import MainHeader from "./MainHeader";


/**
 * The Main (center) pane that hosts the component.
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
      <Card>
        <MainHeader/>
      </Card>
    );
  }
}


Main.propTypes = {};
Main.defaultProps = {};

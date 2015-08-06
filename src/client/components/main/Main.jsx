import React from "react";
import Radium from "radium";
import Immutable from "immutable";
import Card from "../shared/Card";
import MainHeader from "./MainHeader";
import ComponentHost from "./ComponentHost";

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
    let { current } = this.props;
    let currentSuite = current.get("suite");
    currentSuite = null;
    return (
      <Card>
        { currentSuite ? <MainHeader current={ current }/> : null }

        <ComponentHost current={ current }/>

      </Card>
    );
  }
}


// API -------------------------------------------------------------------------
Main.propTypes = {
  current: React.PropTypes.instanceOf(Immutable.Map).isRequired
};
Main.defaultProps = {};

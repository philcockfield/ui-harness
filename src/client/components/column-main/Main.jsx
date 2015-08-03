import React from "react";
import Radium from "radium";
import Immutable from "immutable";
import Card from "../shared/Card";
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
    const { current } = this.props;
    const currentSuite = current.get("suite");
    return (
      <Card>
        { currentSuite ? <MainHeader current={ current }/> : null }
      </Card>
    );
  }
}


// API -------------------------------------------------------------------------
Main.propTypes = {
  current: React.PropTypes.instanceOf(Immutable.Map).isRequired
};
Main.defaultProps = {};

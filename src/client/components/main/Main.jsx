import React from "react";
import Radium from "radium";
import Immutable from "immutable";
import Card from "../shared/Card";
import MainHeader from "./MainHeader";
import ComponentHost from "./ComponentHost";
import { css, PropTypes } from "js-util/react";

/**
 * The Main (center) pane that hosts the component.
 */
 @Radium
export default class Main extends React.Component {
  styles() {
    const { current } = this.props;
    const margin = current.get("margin");
    return css({
      base: {
        Absolute: 0,
        overflow: "hidden"
      },
      componentOuter: {
        Absolute: [margin, margin, margin, margin]
      }
    });
  }

  render() {
    const styles = this.styles();
    let { current } = this.props;
    let currentSuite = current.get("suite");
    currentSuite = null;
    return (
      <Card>
        <div style={ styles.base }>
          { currentSuite ? <MainHeader current={ current }/> : null }

          <div style={ styles.componentOuter }>
            <ComponentHost current={ current }/>
          </div>
        </div>
      </Card>
    );
  }
}


// API -------------------------------------------------------------------------
Main.propTypes = {
  current: React.PropTypes.instanceOf(Immutable.Map).isRequired
};
Main.defaultProps = {};

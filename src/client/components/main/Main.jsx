import React from "react";
import Radium from "radium";
import Immutable from "immutable";
import { css, PropTypes } from "js-util/react";
import Card from "../shared/Card";
import MainHeader from "./MainHeader";
import Component from "./Component";
import ComponentAlign from "./ComponentAlign";
import ComponentHost from "./ComponentHost";


/**
 * The Main (center) pane that hosts the component.
 */
 @Radium
export default class Main extends React.Component {
  styles() {
    const { current } = this.props;
    return css({
      base: {
        Absolute: 0,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        overflowY: "auto"
      },
      headerContainer: {
        position: "relative",
        borderBottom: "solid 1px rgba(0, 0, 0, 0.3)"
      },
      hostContainer: {
        position: "relative",
        flex: "1",
        minHeight: "50%"
      }
    });
  }

  render() {
    const styles = this.styles();
    let { current } = this.props;

    return (
      <Card>
        <div style={ styles.base }>
          <div style={ styles.headerContainer }>
            <MainHeader current={ current }/>
          </div>
          <div style={ styles.hostContainer }>
            <ComponentHost current={ current }/>
          </div>
        </div>
      </Card>
    );
  }
}


// API -------------------------------------------------------------------------
Main.propTypes = {
  current: PropTypes.instanceOf(Immutable.Map).isRequired
};
Main.defaultProps = {};

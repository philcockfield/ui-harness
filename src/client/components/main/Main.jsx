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
    const header = current.get("header");
    return css({
      base: {
        Absolute: 0,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
      },
      headerContainer: {
        position: "relative",
      },
      hostContainer: {
        position: "relative",
        flex: "1",
      }
    });
  }

  render() {
    const styles = this.styles();
    const { current } = this.props;

    let header = current.get("header");
    if (header) {
      header = <div style={ styles.headerContainer }>
                 <MainHeader markdown={ header }/>
               </div>
    }

    return (
      <Card>
        <div style={ styles.base }>
          { header }
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

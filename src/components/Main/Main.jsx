import _ from "lodash";
import React from "react";
import Radium from "radium";
import Immutable from "immutable";
import Color from "color";
import { css, PropTypes } from "js-util/react";
import Card from "../shared/Card";
import MainHeader from "./MainHeader";
import Component from "./Component";
import ComponentHost from "./ComponentHost";
import Output from "../Output";


/**
 * The Main (center) pane that hosts the component.
 */
 @Radium
export default class Main extends React.Component {
  backgroundColor() {
    let color = this.props.current.get("backdrop");
    if (_.isNumber(color)) {
      if (color < 0) { color = 0; }
      if (color > 1) { color = 1; }
      color = css.white.darken(color);
    }
    return color;
  }

  styles() {
    const { current } = this.props;
    const header = current.get("header");
    const scroll = current.get("scroll");
    const overflowX = (scroll === true || scroll === "x" || scroll === "x:y") ? "auto" : null
    const overflowY = (scroll === true || scroll === "y" || scroll === "x:y") ? "auto" : null

    return css({
      base: {
        Absolute: 0,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        backgroundColor: this.backgroundColor()
      },
      headerContainer: {
        position: "relative",
      },
      hostContainer: {
        position: "relative",
        flex: "1",
        overflowX: overflowX,
        overflowY: overflowY
      }
    });
  }

  render() {
    const styles = this.styles();
    const { current } = this.props;
    const isDark = Color(this.backgroundColor()).dark();

    let header = current.get("header");
    if (header) {
      header = <div style={ styles.headerContainer }>
                 <MainHeader
                    markdown={ header }
                    hr={ current.get("hr") }
                    isDark={ isDark }/>
               </div>
    }

    let el = <ComponentHost current={ current }/>;

    // Swap out the main host with the log if required.
    const log = current.get("log");
    el = current.get("showLog") && log
            ? el = <Output items={ log.toJS() }/>
            : el;

    return (
      <Card>
        <div style={ styles.base }>
          { header }
          <div style={ styles.hostContainer }>
            { el }
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

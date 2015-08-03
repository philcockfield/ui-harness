import React from "react";
import Radium from "radium";
import Immutable from "immutable";

import { css } from "js-util/react";
import api from "../../../shared/api-internal";
import SuiteTree from "./SuiteTree";
import Suite from "./Suite";



/**
 * The index column.
 */
@Radium
export default class IndexColumn extends React.Component {
  styles() {
    const { current, width } = this.props;
    const MODE = current.get("indexMode") || "tree";

    // Calculate slide position of panels.
    if (MODE && width) {
      var suitesLeft = MODE === "tree" ? 0 : (0 - width)
      var specsLeft = MODE === "suite" ? 0 : width
    }

    return css({
      base: {
        Absolute: 0,
        overflowY: "auto",
        overflowX: "hidden",
        paddingTop: 3
      },
      outer: {
        transition: "left 0.15s"
      },
      suiteTree: {
        position: "absolute", top: 0, bottom: 0,
        width: "100%",
        left: suitesLeft
      },
      specs: {
        position: "absolute", top: 0, bottom: 0,
        width: "100%",
        left: specsLeft,
      }
    });
  }

  render() {
    const styles = this.styles();
    const { current, width } = this.props;
    const currentSuite = current.get("suite");

    return (
      <div style={ styles.base }>
        <div style={[ styles.outer, styles.suiteTree ]}>
          <SuiteTree selectedSuite={ currentSuite } width={ width } />
        </div>
        <div style={[ styles.outer, styles.specs ]}>
          { currentSuite ? <Suite suite={ currentSuite } /> : null }
        </div>
      </div>
    );
  }
}


// API -------------------------------------------------------------------------
IndexColumn.propTypes = {
  current: React.PropTypes.instanceOf(Immutable.Map).isRequired,
  width: React.PropTypes.number.isRequired
};
IndexColumn.defaultProps = {};

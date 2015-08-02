import React from "react";
import Radium from "radium";
import Immutable from "immutable";

import { css } from "js-util/react";
import api from "../../../shared/api-internal";
import SuiteTree from "./SuiteTree";
import Specs from "./Specs";



/**
 * The index column.
 */
@Radium
export default class IndexColumn extends React.Component {
  componentDidMount() { this.updateWidth(); }
  updateWidth() { this.setState({ width:React.findDOMNode(this).offsetWidth }); }


  styles() {
    const { current } = this.props;
    const MODE = current.get("indexViewMode");

    // Calculate slide position of panels.
    const WIDTH = this.state.width
    if (MODE && WIDTH) {
      var suitesLeft = MODE === 'suites' ? 0 : (0 - WIDTH)
      var specsLeft = MODE === 'specs' ? 0 : WIDTH
    }

    return css({
      base: {
        position: "absolute", left: 0, top: 0, right: 0, bottom: 0,
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
    const { current } = this.props;
    const indexViewMode = current.get("indexViewMode");
    const currentSuite = current.get("suite");

    return (
      <div style={ styles.base }>
        <div style={[ styles.outer, styles.suiteTree ]}>
          <SuiteTree selectedSuite={ currentSuite } />
        </div>
        <div style={[ styles.outer, styles.specs ]}>
          { currentSuite ? <Specs suite={ currentSuite } /> : null }
        </div>
      </div>
    );
  }
}


// API -------------------------------------------------------------------------
IndexColumn.propTypes = {
  current: React.PropTypes.instanceOf(Immutable.Map).isRequired
};
IndexColumn.defaultProps = {};

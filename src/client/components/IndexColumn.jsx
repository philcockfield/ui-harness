import React from "react";
import Radium from "radium";
import Immutable from "immutable";

import { css, PropTypes } from "js-util/react";
import api from "../../shared/api-internal";
import SuiteTree from "./SuiteTree";
import Suite from "./Suite";
import { FONT_SANS } from "../const";


/**
 * The index column.
 */
@Radium
export default class IndexColumn extends React.Component {
  componentWillMount() {
    document.addEventListener ("keydown", this.handleKeyDown.bind(this));
  }


  handleKeyDown(e) {
    if (this.isOver) {
      // Alert child components of the key-event.
      switch (api.indexMode()) {
        case "tree":
          this.refs.suiteTree.handleKeyDown(e);
          break;

        case "suite":
          this.refs.suite.handleKeyDown(e);
          break;
      }
    }
  }


  styles() {
    const { current, width } = this.props;
    const indexMode = api.indexMode();

    // Calculate slide position of panels.
    if (indexMode && width) {
      var suiteTreeLeft = indexMode === "tree" ? 0 : (0 - width);
      var suiteLeft = indexMode === "suite" ? 0 : width;
    }

    return css({
      base: {
        Absolute: 0,
        overflow: "hidden",
        fontFamily: FONT_SANS,
        userSelect: "none"
      },
      outer: {
        transition: "transform 0.15s"
      },
      suiteTree: {
        position: "absolute", top: 4, bottom: 0, left: 0,
        width: "100%",
        transform: `translateX(${ suiteTreeLeft }px)`
      },
      specs: {
        position: "absolute", top: 0, bottom: 0, left: 0,
        width: "100%",
        transform: `translateX(${ suiteLeft }px)`
      }
    });
  }


  handleMouseEnter() { this.isOver = true; }
  handleMouseLeave() { this.isOver = false; }


  render() {
    const styles = this.styles();
    const { current, width } = this.props;
    const currentSuite = current.get("suite");

    return (
      <div style={ styles.base }
           className="uih"
           onMouseEnter={ this.handleMouseEnter.bind(this) }
           onMouseLeave={ this.handleMouseLeave.bind(this) }>

        <div style={[ styles.outer, styles.suiteTree ]}>
          <SuiteTree ref="suiteTree" selectedSuite={ currentSuite } width={ width } />
        </div>
        <div style={[ styles.outer, styles.specs ]}>
          {
            currentSuite
              ? <Suite ref="suite" suite={ currentSuite } current={ current } />
              : null
          }
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

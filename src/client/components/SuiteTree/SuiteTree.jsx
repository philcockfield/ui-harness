import _ from "lodash";
import React from "react";
import Radium from "radium";
import api from "../../../shared/api-internal";
import bdd from "../../../shared/bdd";
import SuiteTreeItem from "./SuiteTreeItem";
import { Ul } from "../shared";
import { css } from "js-util/react";


/**
 * The index tree-view of [Suites].
 */
@Radium
export default class SuiteTree extends React.Component {
  styles() {
    return css({
      base: {
        userSelect: "none",
        position: "absolute", left: 0, top: 0, right:0, bottom: 0
      }
    });
  }

  handleOverSuite(e) { this.mouseOverItem = e; }
  handleMouseLeave() { this.mouseOverItem = null; }
  handleKeyDown(e) {
    const { selectedSuite } = this.props;
    const item = this.mouseOverItem;
    const suite = item ? item.suite : null;
    if (item) {
      switch (e.which) {
        case 37: // LEFT.
          item.toggle(false);
          break;

        case 39: // RIGHT.
          if (suite) {
            if (selectedSuite && selectedSuite.id === suite.id) {
              api.indexMode("suite"); // Drill into already loaded suite.
            } else {
              api.loadSuite(suite); // Load the new suite.
            }
          } else {
            item.toggle(true);
          }
          break;
      }
    }
  }


  render() {
    const styles = this.styles();
    const { selectedSuite, width } = this.props;

    // Filter on root suites.
    const suites = bdd.rootSuites()
    const items = suites.map((suite, i) => {
        return <SuiteTreeItem
                  key={i}
                  suite={ suite }
                  index={i}
                  total={ suites.length }
                  isRoot={ true }
                  selectedSuite={ selectedSuite }
                  onOverSuite={ this.handleOverSuite.bind(this) }
                  width={ width }/>
    });

    return (
      <div className="uih-suite-tree" style={ styles.base } onMouseLeave={ this.handleMouseLeave.bind(this) }>
        <Ul>{ items }</Ul>
      </div>
    );
  }
}

// API -------------------------------------------------------------------------
SuiteTree.propTypes = {
  selectedSuite: React.PropTypes.object,
  width: React.PropTypes.number.isRequired
};
SuiteTree.defaultProps = {};

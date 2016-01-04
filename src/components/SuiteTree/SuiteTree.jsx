import _ from "lodash";
import React from "react";
import Radium from "radium";
import api from "../../shared/api-internal";
import bdd from "../../shared/bdd";
import { Ul } from "../shared";
import { css, PropTypes } from "js-util/react";
import SuiteTreeItem from "./SuiteTreeItem";
import SuiteTreeEmpty from "./SuiteTreeEmpty";


/**
 * The index tree-view of [Suites].
 */
class SuiteTree extends React.Component {
  static propTypes = {
    selectedSuite: React.PropTypes.object,
    width: React.PropTypes.number.isRequired
  };
  static defaultProps = {};

  styles() {
    return css({
      base: {
        Absolute: 0,
        userSelect: "none",
        overflow: "hidden",
        overflowY: "auto"
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
      <div style={ styles.base }
           onMouseLeave={ this.handleMouseLeave.bind(this) }>
        {
          items.length > 0
            ? <Ul>{ items }</Ul>
            : <SuiteTreeEmpty/>
        }
      </div>
    );
  }
}

export default Radium(SuiteTree);

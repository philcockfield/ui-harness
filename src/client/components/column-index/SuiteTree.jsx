import _ from "lodash";
import React from "react";
import Radium from "radium";
import api from "../../../shared/api-internal";
import bdd from "../../../shared/bdd";
import SuiteListItem from "./SuiteListItem";
import { Ul } from "../shared";
import { css } from "js-util/react";


/**
 * The index tree-view of [Suites].
 */
@Radium
export default class SuiteTree extends React.Component {
  componentWillMount() {
    document.addEventListener ("keydown", this.handleKeyDown.bind(this));
  }


  handleKeyDown(e) {
    const keyCode = e.which;
    const item = this.mouseOverItem;
    const suite = item ? item.suite : null;
    if (item) {
      switch (e.which) {
        case 37: // LEFT.
          item.toggle(false);
          break;

        case 39: // RIGHT.
          if (suite) {
            api.loadSuite(suite);
          } else {
            item.toggle(true);
          }
          break;
      }
    }
  }


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


  render() {
    const styles = this.styles();
    const { selectedSuite } = this.props;

    // Filter on root suites.
    const suites = bdd.rootSuites()
    const items = suites.map((suite, i) => {
        return <SuiteListItem
                  key={i}
                  suite={ suite }
                  index={i}
                  total={ suites.length }
                  isRoot={ true }
                  selectedSuite={ selectedSuite }
                  onOverSuite={ this.handleOverSuite.bind(this) }/>
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
  selectedSuite: React.PropTypes.object
};
SuiteTree.defaultProps = {};

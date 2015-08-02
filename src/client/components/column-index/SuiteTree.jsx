import _ from "lodash";
import React from "react";
import Radium from "radium";
import api from "../../api-internal";
import bdd from "js-bdd";
import SuiteListItem from "./SuiteListItem";
import { Ul } from "../shared";


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
        case 37: // LEFT
          item.toggle(false);
          break;

        case 39: // RIGHT
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
    return {
      base: {
        userSelect: "none"
      }
    };
  }


  suites() {
    const getRoot = (suite) => {
        const parent = suite.parentSuite;
        return parent ? getRoot(parent) : suite;
    };
    let suites = bdd.suites();
    suites = _.filter(suites, suite => _.isUndefined(suite.parentSuite) || suite.isOnly);
    suites = suites.map(suite => getRoot(suite));
    suites = _.compact(_.unique(suites));
    return suites;
  }


  handleOverSuite(e) { this.mouseOverItem = e; }
  handleMouseLeave() { this.mouseOverItem = null; }


  render() {
    const styles = this.styles();
    const { selectedSuite } = this.props;

    // Filter on root suites.
    const suites = this.suites()
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
      <div style={ styles.base } onMouseLeave={ this.handleMouseLeave.bind(this) }>
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

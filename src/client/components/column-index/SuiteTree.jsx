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
  styles() {
    return {
      base: {
        // background: "rgba(255, 0, 0, 0.1)", //RED
      }
    };
  }

  render() {
    const styles = this.styles();
    const { selectedSuite } = this.props;

    // Filter on root suites.
    const suites = _.filter(bdd.suites(), suite => _.isUndefined(suite.parentSuite));
    const items = suites.map((suite, i) => {
        return <SuiteListItem
                  key={i}
                  suite={ suite }
                  index={i}
                  total={ suites.length }
                  isRoot={ true }
                  selectedSuite={ selectedSuite }/>
    });

    return (
      <div style={ styles.base }>
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

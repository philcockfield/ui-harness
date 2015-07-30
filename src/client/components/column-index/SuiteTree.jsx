import _ from "lodash";
import React from "react";
import Radium from "radium";
import api from "../../api-internal";
import bdd from "js-bdd";
import SuiteItem from "./SuiteItem";
import { UL } from "../shared";


/**
 * The index tree-view of [Suites].
 */
@Radium
export default class SuiteTree extends React.Component {
  constructor(props) {
    super(props);
  }

  styles() {
    return {
      base: {
        background: "rgba(255, 0, 0, 0.1)", //RED
      }
    };
  }

  render() {
    const styles = this.styles();
    // let { currentSuite } = this.props;

    // Filter on root suites.
    let suites = _.filter(bdd.suites(), suite => _.isUndefined(suite.parentSuite));

    return (
      <div style={ styles.base }>
        <UL>{ suites.map((suite, i) => <SuiteItem key={i} suite={ suite }/>) }</UL>
      </div>
    );
  }
}

// -----------------------------------------------------------------------------
SuiteTree.propTypes = {
  currentSuite: React.PropTypes.object
};
SuiteTree.defaultProps = {};

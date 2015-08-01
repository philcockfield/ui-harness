import React from "react";
import Radium from "radium";
import Immutable from "immutable";
import api from "../../api-internal";
import SuiteTree from "./SuiteTree";


/**
 * The index column.
 */
@Radium
export default class IndexColumn extends React.Component {
  styles() {
    return {
      base: {
        position: "absolute", left: 0, top: 0, right: 0, bottom: 0,
        overflowY: "auto",
        overflowX: "hidden",
        paddingTop: 3
      }
    };
  }

  render() {
    const styles = this.styles();
    let { current } = this.props;
    return (
      <div style={ styles.base }>
        <SuiteTree selectedSuite={ current.get("suite") } />
      </div>
    );
  }
}


// API -------------------------------------------------------------------------
IndexColumn.propTypes = {
  current: React.PropTypes.instanceOf(Immutable.Map).isRequired
};
IndexColumn.defaultProps = {};

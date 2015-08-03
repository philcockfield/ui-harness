import React from "react";
import Radium from "radium";
import { css, PropTypes } from "js-util/react";
import api from "../../../shared/api-internal";
import SuiteHeader from "./SuiteHeader";


/**
 * The index-column view a [Suite]'s set of specs.
 */
@Radium
export default class Suite extends React.Component {
  styles() {
    return css({
      base: {
        position: "absolute", left: 0, top: 0, right: 0, bottom: 0,
      }
    });
  }


  handleKeyDown(e) {
    switch (e.which) {
      case 37: // LEFT.
        api.indexMode("tree");
        break;
    }
  }


  render() {
    const styles = this.styles();
    let { suite } = this.props;
    return (
      <div style={ styles.base }>
        <SuiteHeader suite={ suite }/>
      </div>
    );
  }
}

// API -------------------------------------------------------------------------
Suite.propTypes = {
  suite: PropTypes.object.isRequired
};
Suite.defaultProps = {};

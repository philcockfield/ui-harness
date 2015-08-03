import React from "react";
import Radium from "radium";
import { css, PropTypes } from "js-util/react";
import api from "../../../shared/api-internal";
import Icon from "../shared/Icon";


/**
 * The header bar for the [Suite] index column.
 */
@Radium
export default class SuiteHeader extends React.Component {
  styles() {
    return css({
      base: {
        background: "rgba(255, 0, 0, 0.1)", //RED
      }
    });
  }

  handleMenuClick(e) {
    api.indexMode("tree");
  }

  render() {
    const styles = this.styles();
    return (
      <div style={ styles.base }>
        <Icon name="suiteBook" onClick={ this.handleMenuClick.bind(this) }/>

      </div>
    );
  }
}

// API -------------------------------------------------------------------------
SuiteHeader.propTypes = {
  suite: PropTypes.object.isRequired
};
SuiteHeader.defaultProps = {};

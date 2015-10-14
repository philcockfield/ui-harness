import React from "react";
import Radium from "radium";
import { css, PropTypes } from "js-util/react";


/**
 * A "getting started" introduction.
 */
@Radium
export default class GettingStarted extends React.Component {
  styles() {
    return css({
      base: {
        background: "rgba(255, 0, 0, 0.1)", //RED
      }
    });
  }

  render() {
    const styles = this.styles();
    return (
      <div style={ styles.base }>GettingStarted</div>
    );
  }
}

// API -------------------------------------------------------------------------
GettingStarted.propTypes = {};
GettingStarted.defaultProps = {};

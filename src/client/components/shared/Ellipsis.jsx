import React from "react";
import Radium from "radium";
import { css, PropTypes } from "js-util/react";


/**
 * Renders text with overflowing ellipsis (...).
 */
@Radium
export default class Ellipsis extends React.Component {
  styles() {
    return css({
      base: {
        display: this.props.display,
        width: this.props.width,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis"
      }
    });
  }

  render() {
    const styles = this.styles();
    return (
      <div style={ styles.base }>{ this.props.children }</div>
    );
  }
}

// API -------------------------------------------------------------------------
Ellipsis.propTypes = {
  width: PropTypes.NUMBER_OR_STRING,
  display: PropTypes.oneOf(["block", "inline-block", "inline"])
};
Ellipsis.defaultProps = {
  width: "100%",
  display: "inline-block"
};

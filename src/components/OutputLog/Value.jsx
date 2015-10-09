import React from "react";
import Radium from "radium";
import { css, PropTypes } from "js-util/react";
import { FONT_MONO } from "../GlobalStyles";

const COLORS = {
  grey: "rgba(0,0,0,0.2)",
  red: "#C61604",
  blue: "#1900D3",
  black: "#000000",
  green: "007500#"
};


/**
 * An <OutputLog> log value.
 */
@Radium
export default class Value extends React.Component {
  styles() {
    const { color, children } = this.props;
    return css({
      base: {
        fontFamily: FONT_MONO,
        color: COLORS[color],
        paddingRight: 6
      }
    });
  }

  render() {
    const styles = this.styles();
    return (
      <span style={ styles.base }>{ this.props.children }</span>
    );
  }
}

// API -------------------------------------------------------------------------
Value.propTypes = {
  color: PropTypes.oneOf(["black", "blue", "red", "grey"]),
};
Value.defaultProps = {
};

import React from "react";
import Radium from "radium";
import { css, PropTypes } from "js-util/react";
import { FONT_MONO, FONT_SANS } from "../GlobalStyles";

const COLORS = {
  grey: "#CFCFCF",
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
    const { color, mono, size, children } = this.props;
    return css({
      base: {
        fontFamily: mono ? FONT_MONO : FONT_SANS,
        fontSize: size,
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
  mono: PropTypes.bool,
  size: PropTypes.numberOrString,
};
Value.defaultProps = {
  mono: true,
  size: 12
};

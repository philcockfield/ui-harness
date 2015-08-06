import React from "react";
import Radium from "radium";
import Color from "color";
import { css, PropTypes } from "js-util/react";

/**
 * A wrapper that puts content within a card.
 */
@Radium
export default class Card extends React.Component {
  styles() {
    const BACKGROUND_COLOR = Color("white").darken(this.props.darken);
    return css({
      base: {
        background: BACKGROUND_COLOR.hexString(),
        Absolute: 0,
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "rgba(0, 0, 0, 0.12)",
        borderRadius: 1,
        boxShadow: "0 0 8px 0px rgba(0, 0, 0, 0.1)",
        padding: this.props.padding
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
Card.propTypes = {
  padding: PropTypes.numberOrString,
  darken: PropTypes.numberOrString
};
Card.defaultProps = {
  padding: 0,
  darken: 0
};

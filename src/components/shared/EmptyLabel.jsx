import React from "react";
import Radium from "radium";
import { css, PropTypes } from "js-util/react";


/**
 * The text label for an empty collection.
 */
class EmptyLabel extends React.Component {
  styles() {
    return css({
      base: {
        fontSize: this.props.size,
        fontStyle: this.props.italic && "italic" ,
        color: this.props.color,
        fontWeight: this.props.weight,
        textAlign: this.props.align
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
EmptyLabel.propTypes = {
  color: PropTypes.string,
  weight: PropTypes.numberOrString,
  size: PropTypes.numberOrString,
  italic: PropTypes.bool,
  align: PropTypes.oneOf(["left", "center", "right"]),
};
EmptyLabel.defaultProps = {
  color: css.white.darken(0.3),
  weight: 300,
  size: 13,
  italic: false,
  align: "center"
};


export default Radium(EmptyLabel);

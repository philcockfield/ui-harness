import React from "react";
import Radium from "radium";
import { css, PropTypes } from "../util";


/**
 * Renders text with overflowing ellipsis (...).
 */
class Ellipsis extends React.Component {
  static propTypes = {
    width: PropTypes.numberOrString,
    display: PropTypes.oneOf(["block", "inline-block", "inline"])
  };
  static defaultProps = {
    width: "100%",
    display: "inline-block"
  };

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

export default Radium(Ellipsis);

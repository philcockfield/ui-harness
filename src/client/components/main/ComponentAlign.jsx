import React from "react";
import Radium from "radium";
import { css, PropTypes } from "js-util/react";


/**
 * Handles alignment of the component.
 */
@Radium
export default class ComponentAlign extends React.Component {
  styles() {
    const { align } = this.props;
    return css({
      base: {
        Absolute: 0,
        background: "rgba(255, 0, 0, 0.1)", //RED
        display: "flex",
        alignItems: "flex-end"
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
ComponentAlign.propTypes = {
  edge: PropTypes.string,
};
ComponentAlign.defaultProps = {};

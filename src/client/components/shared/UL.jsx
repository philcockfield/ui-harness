import React from "react";
import Radium from "radium";
import { css, PropTypes } from "js-util/react";

/**
 * An unstyled <ul>.
 */
@Radium
export default class Ul extends React.Component {
  styles() {
    return {
      base: {
        margin: 0,
        padding: this.props.padding,
        listStyleType: "none"
      }
    };
  }

  render() {
    const styles = this.styles();
    return (
      <ul style={ styles.base }>{ this.props.children }</ul>
    );
  }
}

// API -------------------------------------------------------------------------
Ul.propTypes = {
  padding: PropTypes.numberOrString
};
Ul.defaultProps = {
  padding: 0
};

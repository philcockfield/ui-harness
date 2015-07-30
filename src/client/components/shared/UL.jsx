import React from "react";
import Radium from "radium";


/**
 * An unstyled <UL>.
 */
@Radium
export default class UL extends React.Component {
  styles() {
    return {
      base: {
        margin: 0,
        padding: 0,
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

// -----------------------------------------------------------------------------
UL.propTypes = {};
UL.defaultProps = {};

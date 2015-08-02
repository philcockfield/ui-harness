import React from "react";
import Radium from "radium";


/**
 * The index view of specs.
 */
@Radium
export default class Specs extends React.Component {
  styles() {
    return {
      base: {}
    };
  }

  render() {
    const styles = this.styles();
    return (
      <div style={ styles.base }>Specs</div>
    );
  }
}

// API -------------------------------------------------------------------------
Specs.propTypes = {};
Specs.defaultProps = {};

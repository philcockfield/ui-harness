import React from "react";
import Radium from "radium";
import Immutable from "immutable";


/**
 * The right-hand column showing PropTypes.
 */
@Radium
export default class PropTypesColumn extends React.Component {
  constructor(props) {
    super(props);
  }

  styles() {
    return {
      base: {
        // background: "rgba(255, 0, 0, 0.1)" //RED
      }
    };
  }

  render() {
    const styles = this.styles();
    return (
      <div style={ styles.base }></div>
    );
  }
}

// API -------------------------------------------------------------------------
PropTypesColumn.propTypes = {
  current: React.PropTypes.instanceOf(Immutable.Map).isRequired,
  width: React.PropTypes.number.isRequired
};
PropTypesColumn.defaultProps = {};

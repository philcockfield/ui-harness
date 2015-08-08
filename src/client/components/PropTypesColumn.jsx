import React from "react";
import Radium from "radium";
import Immutable from "immutable";
import { css, PropTypes } from "js-util/react";


/**
 * The right-hand column showing PropTypes.
 */
@Radium
export default class PropTypesColumn extends React.Component {
  constructor(props) {
    super(props);
  }

  styles() {
    return css({
      base: {}
    });
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
  current: PropTypes.instanceOf(Immutable.Map).isRequired,
  width: PropTypes.number.isRequired
};
PropTypesColumn.defaultProps = {};

import React from "react";
import Radium from "radium";
import Immutable from "immutable";
import { css, PropTypes } from "js-util/react";


/**
 * An spec list-item that is invoked on the server.
 */
@Radium
export default class SpecListServerItem extends React.Component {
  styles() {
    return css({
      base: {}
    });
  }

  render() {
    const styles = this.styles();
    return (
      <li style={ styles.base }>Server Method</li>
    );
  }
}

// API -------------------------------------------------------------------------
SpecListServerItem.propTypes = {
  spec: PropTypes.object.isRequired,
  current: PropTypes.instanceOf(Immutable.Map).isRequired
};
SpecListServerItem.defaultProps = {};

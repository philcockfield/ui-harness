import React from "react";
import Radium from "radium";


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
      base: {}
    };
  }

  render() {
    const styles = this.styles();
    return (
      <div style={ styles.base }>PropTypesColumn</div>
    );
  }
}


PropTypesColumn.propTypes = {};
PropTypesColumn.defaultProps = {};

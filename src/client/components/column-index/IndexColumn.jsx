import React from "react";
import Radium from "radium";
import Immutable from "immutable";


/**
 * The index column.
 */
@Radium
export default class IndexColumn extends React.Component {
  constructor(props) {
    super(props);
  }

  styles() {
    return {
      base: {
        background: "rgba(255, 0, 0, 0.1)" //RED
      }
    };
  }

  render() {
    const styles = this.styles();
    let { current } = this.props;
    return (
      <div style={ styles.base }>IndexColumn</div>
    );
  }
}


// -----------------------------------------------------------------------------
IndexColumn.propTypes = {
  current: React.PropTypes.instanceOf(Immutable.Map).isRequired
};
IndexColumn.defaultProps = {};

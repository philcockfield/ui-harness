import React from "react";
import Radium from "radium";


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
    return (
      <div style={ styles.base }>IndexColumn</div>
    );
  }
}


IndexColumn.propTypes = {};
IndexColumn.defaultProps = {};

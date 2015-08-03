import React from "react";
import Radium from "radium";
import { css } from "js-util/react";
import api from "../../../shared/api-internal";



/**
 * The index view of specs.
 */
@Radium
export default class Specs extends React.Component {
  styles() {
    return css({
      base: {
        position: "absolute", left: 0, top: 0, right: 0, bottom: 0,
        background: "rgba(255, 0, 0, 0.1)", //RED
      },
      backButton: {
        position: "absolute", left: 10, top: 10,
        width: 30,
        height: 30,
        cursor: "pointer",
        background: "rgba(255, 0, 0, 0.1)", //RED
      }
    });
  }


  handleBackClick() {
    api.indexMode("tree");
  }

  render() {
    const styles = this.styles();
    return (
      <div style={ styles.base }>
        <div style={ styles.backButton } onClick={ this.handleBackClick.bind(this) }/>
        Specs
      </div>
    );
  }
}

// API -------------------------------------------------------------------------
Specs.propTypes = {
  suite: React.PropTypes.object.isRequired,
};
Specs.defaultProps = {};

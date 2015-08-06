import React from "react";
import Radium from "radium";
import { css, PropTypes } from "js-util/react";
import CropMark from "./CropMark";


/**
 * Positions a set of crop-marks around it's contents.
 */
@Radium
export default class CropMarks extends React.Component {
  constructor(props) {
    super(props);
  }

  styles() {
    return css({
      base: {
        position: "relative"
      }
    });
  }

  render() {
    const styles = this.styles();
    return (
      <div style={ styles.base }>
        { this.props.children }
        <CropMark edge="topLeft"/>
        <CropMark edge="topRight"/>
        <CropMark edge="bottomLeft"/>
        <CropMark edge="bottomRight"/>
      </div>
    );
  }
}

// API -------------------------------------------------------------------------
CropMarks.propTypes = CropMark.propTypes;
CropMarks.defaultProps = CropMark.defaultProps;

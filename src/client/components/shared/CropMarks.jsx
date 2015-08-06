import _ from "lodash";
import React from "react";
import Radium from "radium";
import { css, PropTypes } from "js-util/react";
import CropMark from "./CropMark";


/**
 * Positions a set of crop-marks around it's contents.
 */
@Radium
export default class CropMarks extends React.Component {
  styles() {
    return css({
      base: {
        position: "relative",
        display: this.props.display
      }
    });
  }

  render() {
    const styles = this.styles();
    const props = this.props;
    return (
      <div style={ styles.base }>
        { this.props.children }
        <CropMark { ...props } edge="topLeft"/>
        <CropMark { ...props } edge="topRight"/>
        <CropMark { ...props } edge="bottomLeft"/>
        <CropMark { ...props } edge="bottomRight"/>
      </div>
    );
  }
}

// API -------------------------------------------------------------------------

let propTypes = _.clone(CropMark.propTypes);
let defaultProps = _.clone(CropMark.defaultProps);

_.merge(propTypes, {
  display: PropTypes.oneOf(["block", "inline-block", "inline"]),
});

_.merge(defaultProps, {
  display: "block"
});


CropMarks.propTypes = propTypes
CropMarks.defaultProps = defaultProps;

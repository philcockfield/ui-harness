import R from "ramda";
import React from "react";
import Radium from "radium";
import { css, PropTypes } from "../util";
import CropMark from "./CropMark";




/**
 * Positions a set of crop-marks around it's contents.
 */
class CropMarks extends React.Component {
  static propTypes = R.merge(R.clone(CropMark.propTypes), {
    display: PropTypes.oneOf(["block", "inline-block", "inline"]),
    width: PropTypes.numberOrString,
    height: PropTypes.numberOrString
  });
  static defaultProps = R.merge(R.clone(CropMark.defaultProps), {
    display: "block",
    width: "auto",
    height: "auto"
  });

  styles() {
    const { width, height } = this.props;
    return css({
      base: {
        position: "relative",
        display: this.props.display,
        width,
        height
      }
    });
  }

  render() {
    const styles = this.styles();
    const props = this.props;
    const { size } = this.props;
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


export default Radium(CropMarks);

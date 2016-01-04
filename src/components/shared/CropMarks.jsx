import _ from "lodash";
import React from "react";
import Radium from "radium";
import { css, PropTypes } from "js-util/react";
import CropMark from "./CropMark";


// Genearted prop-types.
let propTypes = _.clone(CropMark.propTypes);
let defaultProps = _.clone(CropMark.defaultProps);

_.merge(propTypes, {
  display: PropTypes.oneOf(["block", "inline-block", "inline"]),
  width: PropTypes.numberOrString,
  height: PropTypes.numberOrString
});

_.merge(defaultProps, {
  display: "block",
  width: "auto",
  height: "auto"
});



/**
 * Positions a set of crop-marks around it's contents.
 */
class CropMarks extends React.Component {
  static propTypes = propTypes;
  static defaultProps = defaultProps;

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

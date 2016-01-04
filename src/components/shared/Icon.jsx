import React from "react";
import Radium from "radium";
import { css, PropTypes } from "js-util/react";
import IconImage from "./IconImage";
import ICONS from "../../../public/images";


const OFFSET = {
  menu: { x:3, y:6 },
  refresh: { x:4, y:4 }
};



/**
 * Represents a standard sized icon.
 */
class Icon extends React.Component {
  static propTypes = {
    name: IconImage.propTypes.name,
    onClick: PropTypes.func,
    opacity: PropTypes.number,
    absolute: PropTypes.string,
    cursor: PropTypes.string,
    clickOffset: PropTypes.shape({
      x: React.PropTypes.number,
      y: React.PropTypes.number
    }),
  };
  static defaultProps = {
    opacity: 1,
    cursor: "default"
  };

  styles() {
    const iconOffset = OFFSET[this.props.name] || {};
    let clickOffset = {};
    if (this.state.isDown) { clickOffset = this.props.clickOffset || 0; }
    let base = {
      textAlign: "left",
      boxSizing: "border-box",
      width: 24,
      height: 24,
      paddingLeft: (iconOffset.x || 0) + (clickOffset.x || 0),
      paddingTop: (iconOffset.y || 0) + (clickOffset.y || 0),
      cursor: this.props.cursor
    };

    // An "absolute" position may have been passed in (optional).
    if (this.props.absolute) {
      base.Absolute = this.props.absolute;
    } else {
      base.position = "relative";
      base.display = "inline-block";
    }
    return css({ base: base });
  }


  handleClick(e) {
    const handler = this.props.onClick;
    if (_.isFunction(handler)) { handler(e); }
  }

  handleMouseDown() { this.setState({ isDown:true }); }
  handleMouseUp() { this.setState({ isDown:false }); }
  handleMouseLeave() { this.setState({ isDown:false }); }


  render() {
    const styles = this.styles();
    let { opacity } = this.props;

    return (
      <div
        style={ styles.base }
        onClick={ this.handleClick.bind(this) }
        onMouseDown={ this.handleMouseDown.bind(this) }
        onMouseUp={ this.handleMouseUp.bind(this) }
        onMouseLeave={ this.handleMouseLeave.bind(this) }>
        <IconImage name={ this.props.name } opacity={ opacity }/>
      </div>
    );
  }
}

export default Radium(Icon);

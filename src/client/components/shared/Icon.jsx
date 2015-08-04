import React from "react";
import Radium from "radium";
import { css, PropTypes } from "js-util/react";
import IconImage from "./IconImage";
import { ICONS } from "../../../images";

const OFFSET = {
  menu: { x:3, y:6 },
  refresh: { x:4, y:4 }
};




/**
 * Represents a standard sized icon.
 */
@Radium
export default class Icon extends React.Component {
  styles() {
    const offset = OFFSET[this.props.name] || {};
    let base = {
      textAlign: "left",
      boxSizing: "border-box",
      width: 24,
      height: 24,
      paddingLeft: offset.x,
      paddingTop: offset.y,
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


  render() {
    const styles = this.styles();
    let { opacity } = this.props;

    return (
      <div
        style={ styles.base }
        onClick={ this.handleClick.bind(this) }>
        <IconImage name={ this.props.name } opacity={ opacity }/>
      </div>
    );
  }
}

// API -------------------------------------------------------------------------
Icon.propTypes = {
  name: IconImage.propTypes.name,
  onClick: PropTypes.func,
  opacity: PropTypes.number,
  absolute: PropTypes.string,
  cursor: PropTypes.string,
};
Icon.defaultProps = {
  opacity: 1,
  cursor: "default"
};

import _ from "lodash";
import React from "react";
import Radium from "radium";
import { css } from "js-util/react";
import { ICONS } from "../../../images";



/**
 * An icon of the system.
 */
@Radium
export default class Icon extends React.Component {
  styles() {
    const icon = ICONS[this.props.name];
    let base = {
      Image: [ icon["1x"], icon["2x"], icon.width, icon.height ],
      opacity: this.props.opacity
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

  render() {
    return (<div style={ this.styles().base }/>);
  }
}

// API -------------------------------------------------------------------------
Icon.propTypes = {
  name: React.PropTypes.oneOf(_.keys(ICONS)).isRequired,
  absolute: React.PropTypes.string,
  opacity: React.PropTypes.number
};
Icon.defaultProps = {
  opacity: 1
};

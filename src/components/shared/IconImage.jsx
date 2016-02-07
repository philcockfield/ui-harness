import React from 'react';
import Radium from 'radium';
import { css, PropTypes } from '../util';
import ICONS from '../../../public/images';



/**
 * Icon image (library).
 */
class Icon extends React.Component {
  static propTypes = {
    name: PropTypes.oneOf(Object.keys(ICONS)).isRequired,
    absolute: PropTypes.string,
    opacity: PropTypes.number,
  };
  static defaultProps = {
    opacity: 1,
  };

  styles() {
    const icon = ICONS[this.props.name];
    const base = {
      Image: [icon['1x'], icon['2x'], icon.width, icon.height],
      opacity: this.props.opacity,
    };

    // An 'absolute' position may have been passed in (optional).
    if (this.props.absolute) {
      base.Absolute = this.props.absolute;
    } else {
      base.position = 'relative';
      base.display = 'inline-block';
    }

    return css({ base });
  }


  render() {
    return (
      <div style={ this.styles().base }/>
    );
  }
}

export default Radium(Icon);

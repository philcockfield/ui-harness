import R from 'ramda';
import React from 'react';
import Radium from 'radium';
import { css, PropTypes } from '../util';
import IconImage from './IconImage';


const OFFSET = {
  menu: { x: 3, y: 6 },
  refresh: { x: 4, y: 4 },
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
      x: PropTypes.number,
      y: PropTypes.number,
    }),
  };
  static defaultProps = {
    opacity: 1,
    cursor: 'default',
  };

  styles() {
    const iconOffset = OFFSET[this.props.name] || {};
    let clickOffset = {};
    if (this.state.isDown) { clickOffset = this.props.clickOffset || 0; }
    const base = {
      textAlign: 'left',
      boxSizing: 'border-box',
      width: 24,
      height: 24,
      paddingLeft: (iconOffset.x || 0) + (clickOffset.x || 0),
      paddingTop: (iconOffset.y || 0) + (clickOffset.y || 0),
      cursor: this.props.cursor,
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


  handleClick = (e) => {
    const handler = this.props.onClick;
    if (R.is(Function, handler)) { handler(e); }
  };

  handleMouseDown = () => { this.setState({ isDown: true }); };
  handleMouseUp = () => { this.setState({ isDown: false }); };
  handleMouseLeave = () => { this.setState({ isDown: false }); };


  render() {
    const styles = this.styles();
    const { opacity } = this.props;

    return (
      <div
        style={ styles.base }
        onClick={ this.handleClick }
        onMouseDown={ this.handleMouseDown }
        onMouseUp={ this.handleMouseUp }
        onMouseLeave={ this.handleMouseLeave }>
        <IconImage name={ this.props.name } opacity={ opacity } />
      </div>
    );
  }
}

export default Radium(Icon);

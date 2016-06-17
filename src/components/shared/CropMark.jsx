import React from 'react';
import Radium from 'radium';
import { css, PropTypes } from '../util';


/**
 * A single crop-mark within the <CropMarks>.
 */
class CropMark extends React.Component {
  static propTypes = {
    edge: PropTypes.oneOf(['topLeft', 'topRight', 'bottomLeft', 'bottomRight']),
    length: PropTypes.number,
    offset: PropTypes.number,
    color: PropTypes.string,
    size: PropTypes.number,
  };
  static defaultProps = {
    size: 20,
    offset: 5,
    color: 'rgba(0, 0, 0, 0.15)',
  };

  styles() {
    const SIZE = this.props.size;
    const OFFSET = this.props.offset;
    const BORDER_COLOR = this.props.color;
    let base;
    let xAxis;
    let yAxis;

    switch (this.props.edge) {
      case 'topLeft':
        base = { Absolute: `-${ SIZE - 1 } auto auto -${ SIZE - 1 }` };
        xAxis = { Absolute: `null ${ OFFSET } 0 0` };
        yAxis = { Absolute: `0 0 ${ OFFSET } auto` };
        break;

      case 'topRight':
        base = { Absolute: `-${ SIZE - 1 } -${ SIZE - 1 } auto auto` };
        xAxis = { Absolute: `auto 0 0 ${ OFFSET }` };
        yAxis = { Absolute: `0 auto ${ OFFSET } 0` };
        break;

      case 'bottomLeft':
        base = { Absolute: `auto auto -${ SIZE - 1 } -${ SIZE - 1 }` };
        xAxis = { Absolute: `0 ${ OFFSET } auto 0` };
        yAxis = { Absolute: `${ OFFSET } 0 0 auto` };
        break;

      case 'bottomRight':
        base = { Absolute: `null -${ SIZE - 1 } -${ SIZE - 1 } auto` };
        xAxis = { Absolute: `0 0 auto ${ OFFSET }` };
        yAxis = { Absolute: `${ OFFSET } auto 0 0` };
        break;

      default: // Ignore.
    }

    base.width = SIZE;
    base.height = SIZE;
    xAxis.borderBottom = `solid 1px ${ BORDER_COLOR }`;
    yAxis.borderRight = `solid 1px ${ BORDER_COLOR }`;
    return css({ base, xAxis, yAxis });
  }

  render() {
    const styles = this.styles();
    let el = null;
    if (this.props.size > 0) {
      el = (
        <div style={ styles.base }>
          <div style={ styles.xAxis } />
          <div style={ styles.yAxis } />
        </div>
      );
    }
    return el;
  }
}


export default Radium(CropMark);

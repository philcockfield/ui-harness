import React from 'react';
import Radium from 'radium';
import moment from 'moment';
import { css, PropTypes } from '../util';
import Value from './Value';


/**
 * A list item within the output log.
 */
class OutputItem extends React.Component {
  static propTypes = {
    time: PropTypes.instanceOf(Date),
    values: PropTypes.array,
  };
  static defaultProps = {
    value: [],
  };

  styles() {
    return css({
      base: {},
      td: {
        borderBottom: 'dashed 1px rgba(0, 0, 0, 0.1)',
        padding: 6,
      },
      left: {
        width: 80,
      },
    });
  }

  render() {
    const styles = this.styles();
    const { time, values } = this.props;
    const valueElements = values.map((value, i) => (<Value key={ i }>{ value }</Value>));

    return (
      <tr style={ styles.base }>
        <td style={ [styles.td, styles.left] }>
          <Value
            color="grey"
            mono={ false }
            size={ 11 }>{ moment(time).format('h:mm:ss:SSSS') }</Value>
        </td>
        <td style={ [styles.td, styles.right] }>
          <Value color="red" size={ 13 }>{ valueElements }</Value>
        </td>
      </tr>
    );
  }
}


export default Radium(OutputItem);

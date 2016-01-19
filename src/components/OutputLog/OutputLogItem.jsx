import React from "react";
import Radium from "radium";
import { css, PropTypes } from "../react-util";
import Value from "./Value";
import moment from "moment";


/**
 * A list item within the output log.
 */
class OutputItem extends React.Component {
  static propTypes = {
    time: PropTypes.instanceOf(Date),
    values: PropTypes.array,
  };
  static defaultProps = {
    value: []
  };

  styles() {
    return css({
      base: {},
      td: {
        borderBottom: "dashed 1px rgba(0, 0, 0, 0.1)",
        padding: 6,
      },
      left: {
        width: 80
      }
    });
  }

  render() {
    const styles = this.styles();
    let { time, values } = this.props;

    values = values.map((value, i) => {
      return <Value key={i}>{ value }</Value>
    });


    return (
      <tr style={ styles.base }>
        <td style={[ styles.td, styles.left ]}>
          <Value
              color="grey"
              mono={false}
              size={11}>{ moment(time).format("h:mm:ss:SSSS") }</Value>
        </td>
        <td style={[ styles.td, styles.right ]}>
          <Value color="red" size={13}>{ values }</Value>
        </td>
      </tr>
    );
  }
}


export default Radium(OutputItem);

import React from "react";
import Radium from "radium";
import { css, PropTypes } from "../react-util";
import OutputLogItem from "./OutputLogItem";


/**
 * An output log.
 */
class Output extends React.Component {
  static propTypes = {
    items: PropTypes.array
  };
  static defaultProps = {
    items: []
  };

  styles() {
    return css({
      base: {
        Absolute: 0,
        overflowY: "auto",
        paddingLeft: 20,
        paddingRight: 20
      },
      table: {
        width: "100%",
        padding: 0,
        marginTop: 0,
        marginBottom: 0
      },
    });
  }

  render() {
    const styles = this.styles();
    let { items } = this.props;
    items = items.reverse();
    items = items.map((item, i) => {
          return <OutputLogItem key={i} time={ item.time } values={ item.values }/>
    });

    return (
      <div style={ styles.base }>
        <table style={ styles.table }>
          <tbody>{ items }</tbody>
        </table>
      </div>
    );
  }
}


export default Radium(Output);

import React from "react";
import Radium from "radium";
import Immutable from "immutable";
import { css, PropTypes } from "../util";
import api from "../../shared/api-internal";


/**
 * An spec list-item that is invoked on the server.
 */
class SpecListServerItem extends React.Component {
  static propTypes = {
    spec: PropTypes.object.isRequired,
    current: PropTypes.instanceOf(Immutable.Map).isRequired
  };
  static defaultProps = {};

  styles() {
    return css({
      base: {}
    });
  }

  handleClick() {
    api.invokeServerSpec(this.props.spec, () => {
      console.log("done");
    })
  }

  render() {
    const styles = this.styles();
    return (
      <li style={ styles.base }>
        Server Method - <a onClick={ this.handleClick.bind(this) }>Invoke</a>
      </li>
    );
  }
}

export default Radium(SpecListServerItem);

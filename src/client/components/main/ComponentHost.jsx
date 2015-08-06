import React from "react";
import Radium from "radium";
import Immutable from "immutable";
import { css, PropTypes } from "js-util/react";


/**
 * Responsible for hosting the current component.
 */
@Radium
export default class ComponentHost extends React.Component {
  constructor(props) {
    super(props);
  }

  styles() {
    return css({
      base: {}
    });
  }

  render() {
    const styles = this.styles();
    const { current } = this.props;

    let element;
    let type = current.get("componentType");
    if (type) {
      element = React.createElement(type,
              current.get("componentProps"),
              current.get("componentChildren")
      );
    }

    return (
      <div style={ styles.base }>{ element }</div>
    );
  }
}

// API -------------------------------------------------------------------------
ComponentHost.propTypes = {
  current: React.PropTypes.instanceOf(Immutable.Map).isRequired
};
ComponentHost.defaultProps = {};

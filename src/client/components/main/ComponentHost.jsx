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
    let { current } = this.props;

    // console.log("current.toJS()", current.toJS());
    console.log("current.get('componentProps')", current.get('componentProps'));

    return (
      <div style={ styles.base }>ComponentHost</div>
    );
  }
}

// API -------------------------------------------------------------------------
ComponentHost.propTypes = {
  current: React.PropTypes.instanceOf(Immutable.Map).isRequired
};
ComponentHost.defaultProps = {};

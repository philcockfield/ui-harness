import React from "react";
import Radium from "radium";
import Immutable from "immutable";
import { css, PropTypes } from "js-util/react";
import Component from "./Component";
import ComponentAlign from "./ComponentAlign";


/**
 * The display host for a component under test.
 */
@Radium
export default class ComponentHost extends React.Component {
  styles() {
    const { current } = this.props;
    const margin = current.get("margin");
    return css({
      base: {
        background: "rgba(255, 0, 0, 0.1)", //RED
        Absolute: [margin, margin, margin, margin],
      }
    });
  }

  render() {
    const styles = this.styles();
    const { current } = this.props;

    return (
      <div style={ styles.base }>
        {
          current.get("componentType")
              ? <ComponentAlign align={ current.get("align") }>
                  <Component current={ current }/>
                </ComponentAlign>
              : null
        }
      </div>
    );
  }
}

// API -------------------------------------------------------------------------
ComponentHost.propTypes = {
  current: PropTypes.instanceOf(Immutable.Map).isRequired
};
ComponentHost.defaultProps = {};

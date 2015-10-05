import React from "react";
import Radium from "radium";
import Immutable from "immutable";
import { css, PropTypes } from "js-util/react";
import Component from "./Component";
import AlignmentContainer from "react-atoms/components/AlignmentContainer";

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
              ? <AlignmentContainer
                      align={ current.get("align") }
                      width={ current.get("width") }
                      height={ current.get("height") }>
                  <Component current={ current }/>
                </AlignmentContainer>
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

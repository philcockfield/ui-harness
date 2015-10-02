import React from "react";
import Radium from "radium";
import Immutable from "immutable";
import { css, PropTypes } from "js-util/react";
import CropMarks from "../shared/CropMarks";
import api from "../../shared/api-internal";

/**
 * Loads and displays a component.
 */
@Radium
export default class Component extends React.Component {
  size() {
    const { current } = this.props;
    let width = current.get("width");
    let height = current.get("height");
    return { width, height }
  }

  styles() {
    const { width, height } = this.size();
    return css({
      base: {
        position: "relative",
        width,
        height
      }
    });
  }


  render() {
    const styles = this.styles();
    const { current } = this.props;
    const { width, height } = this.size();

    let element;
    let type = current.get("componentType");
    if (type) {
      const props = current.get("componentProps") || {};
      props.ref = (c) => api.component(c); // Store component instance on load.
      element = React.createElement(type,
                    props,
                    current.get("componentChildren"));
    }

    const cropMarksSize = current.get("cropMarks")
        ? current.get("cropMarks.size")
        : 0

    return (
      <CropMarks
            size={ cropMarksSize }
            offset={ current.get("cropMarks.offset") }
            display={ width === "100%" ? "block" : "inline-block" }
            width={ width }
            height={ height }>
        <div style={ styles.base }>{ element }</div>
      </CropMarks>
    );
  }
}

// API -------------------------------------------------------------------------
Component.propTypes = {
  current: PropTypes.instanceOf(Immutable.Map).isRequired
};
Component.defaultProps = {};

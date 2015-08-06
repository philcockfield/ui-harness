import React from "react";
import Radium from "radium";
import Immutable from "immutable";
import { css, PropTypes } from "js-util/react";
import CropMarks from "../shared/CropMarks";


/**
 * Responsible for hosting the current component.
 */
@Radium
export default class ComponentHost extends React.Component {
  constructor(props) {
    super(props);
  }

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
        background: "rgba(255, 0, 0, 0.1)", //RED
        position: "relative",
        width: width,
        height: height
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
      element = React.createElement(type,
                    current.get("componentProps"),
                    current.get("componentChildren"));
    }

    return (
          current.get("cropMarks") === true
            ? <CropMarks
                    size={ current.get("cropMarks.size") }
                    offset={ current.get("cropMarks.offset") }
                    display={ width === "100%" ? "block" : "inline-block" }>
                <div style={ styles.base }>{ element }</div>
              </CropMarks>

            : <div style={ styles.base }>{ element }</div>
    );
  }
}

// API -------------------------------------------------------------------------
ComponentHost.propTypes = {
  current: React.PropTypes.instanceOf(Immutable.Map).isRequired
};
ComponentHost.defaultProps = {};

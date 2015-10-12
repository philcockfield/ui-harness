import React from "react";
import Radium from "radium";
import { css, PropTypes } from "js-util/react";
import Value from "react-object";



/**
 * Renders a visual representation of the PropTypes API.
 */
@Radium
export default class PropTypesComponent extends React.Component {
  styles() {
    return css({
      base: {}
    });
  }

  render() {
    const styles = this.styles();
    const { instance, type } = this.props;
    const propTypes = type.propTypes;
    const props = instance.props

    console.log("instance", instance);
    console.log("type", type);
    console.log("props", props);
    console.log("propTypes", propTypes);
    console.log("");
    // console.log("typ", typ);

    return (
      <div style={ styles.base }>
        <Value
            label="TEMP"
            value={ props }
            isExpanded={ true }
            size={12}/>
      </div>
    );
  }
}

// API -------------------------------------------------------------------------
PropTypesComponent.propTypes = {
  instance: PropTypes.object.isRequired,
  type: PropTypes.func.isRequired,
};
PropTypesComponent.defaultProps = {};

import React from "react";
import Radium from "radium";
import { css, PropTypes } from "js-util/react";

import Foo from "react-atoms/components/Foo";


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
    return (
      <div style={ styles.base }>
        <Foo>PropTypes</Foo>
      </div>
    );
  }
}

// API -------------------------------------------------------------------------
PropTypesComponent.propTypes = {};
PropTypesComponent.defaultProps = {};

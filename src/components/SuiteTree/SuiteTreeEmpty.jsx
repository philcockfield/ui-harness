import React from "react";
import Radium from "radium";
import { css, PropTypes } from "js-util/react";
import { IconImage } from "../shared";


/**
 * The empty message when no Suites have been declared.
 */
@Radium
export default class SuiteTreeEmpty extends React.Component {
  constructor(props) {
    super(props);
  }
  styles() {
    const textColor = css.white.darken(0.3);
    return css({
      base: {
        paddingTop: 20,
        textAlign: "center",
        fontSize: 13,
        fontStyle: "italic",
        color: textColor,
        fontWeight: 200
      },
      a: { color: textColor },
      icon: {
        marginBottom: 12,
        opacity: 0.1
      }
    });
  }

  render() {
    const styles = this.styles();
    return (
      <div style={ styles.base }>
        <div style={ styles.icon }>
          <IconImage name="startStar"/>
        </div>
        Add some test suites.
      </div>
    );
  }
}

// API -------------------------------------------------------------------------
SuiteTreeEmpty.propTypes = {};
SuiteTreeEmpty.defaultProps = {};

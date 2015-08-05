import React from "react";
import Radium from "radium";
import { css, PropTypes } from "js-util/react";


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
        color: textColor
      },
      a: {
        color: textColor
      }
    });
  }

  render() {
    const styles = this.styles();
    return (
      <div style={ styles.base }>
        Add some suites to <a
          style={ styles.a }
          href="https://github.com/philcockfield/ui-harness/blob/master/docs/getting-started"
          target="_blank">
          get started</a>.
      </div>
    );
  }
}

// API -------------------------------------------------------------------------
SuiteTreeEmpty.propTypes = {};
SuiteTreeEmpty.defaultProps = {};

import React from "react";
import Radium from "radium";
import { css, PropTypes } from "js-util/react";
import { Markdown } from "../shared";


/**
 * The optional Footer content for the [Main] component host.
 */
@Radium
export default class Footer extends React.Component {
  styles() {
    return css({
      base: {
        padding: "0 20px"
      },
      markdownOuter: {
        maxWidth: this.props.maxWidth,
        margin: "0 auto",
        paddingBottom: 40
      }
    });
  }

  render() {
    const styles = this.styles();
    return (
      <div style={ styles.base } className="uih">
        <div style={ styles.markdownOuter }>
          <Markdown className={`uih-markdown ${ this.props.isDark && "uih-dark" }`}>
            { this.props.markdown }
          </Markdown>
        </div>
      </div>
    );
  }
}

// API -------------------------------------------------------------------------
Footer.propTypes = {
  markdown: PropTypes.string,
  isDark: PropTypes.bool,
  maxWidth: PropTypes.numberOrString,
};
Footer.defaultProps = {
  isDark: false,
  maxWidth: 600
};

import React from "react";
import Radium, { Style } from "radium";
import Immutable from "immutable";
import { css, PropTypes } from "js-util/react";
import { FONT_SANS } from "../GlobalStyles";
import { Markdown } from "../shared";
const TEXT_COLOR = css.white.darken(0.5);
const HR_COLOR = "rgba(0, 0, 0, 0.1)";

const HEADER_STYLES = css({
  "h1": {
    fontSize: 32,
    lineHeight: "40px",
    padding: 0,
    margin: 0,
    fontWeight: 700
  },
  "h2": {
    fontSize: 20,
    lineHeight: "28px",
    padding: 0,
    margin: 0,
    fontWeight: 200,
    borderColor: HR_COLOR,
    borderBottomStyle: "solid",
    borderBottomWidth: "1px",
    paddingBottom: 8,
    marginBottom: 10,
    marginTop: 30
  },
  "h2:first-of-type": {
    border: "none",
    padding: 0,
    margin: 0
  },
  "h3": {
    fontSize: 18,
    padding: 0,
    margin: 0,
    marginTop: 30
  },
  "h4": {
    fontSize: 14,
    textTransform: "uppercase",
    padding: 0,
    margin: 0,
    marginTop: 30,
    color: css.white.darken(0.3)
  },
  "p": {
    fontWeight: 200,
    fontSize: 15,
    lineHeight: "22px",
    marginTop: 0,
    marginBottom: 15
  },
  "ul": {
    fontWeight: 200,
    fontSize: 15,
    lineHeight: "22px"
  },
  "hr": {
    borderColor: HR_COLOR,
    borderBottomStyle: "solid",
    borderBottomWidth: "1px",
    borderTopWidth: 0,
    marginTop: 20,
    marginBottom: 20
  },
  "hr:last-child": {
    marginBottom: 0
  }
});



/**
 * The header of the [main] component host.
 */
@Radium
export default class MainHeader extends React.Component {
  styles() {
    return css({
      base: {
        paddingTop: 15,
        paddingLeft: 20,
        paddingRight: 20,
        fontFamily: FONT_SANS,
        color: TEXT_COLOR
      }
    });
  }

  render() {
    const styles = this.styles();
    return (
      <div style={ styles.base } className="uih">
        <div className="uih-header">
          <Style rules={ HEADER_STYLES } scopeSelector=".uih-header"/>
          <Markdown
                display="block"
                trimIndent={true}
                escapeHtml={false}>
            { this.props.markdown }
          </Markdown>
        </div>
      </div>
    );
  }
}

// API -------------------------------------------------------------------------
MainHeader.propTypes = {
  markdown: PropTypes.string,
};
MainHeader.defaultProps = {};

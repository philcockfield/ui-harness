import React from "react";
import { PropTypes } from "js-util/react";
import Markdown from "react-atoms/components/Markdown";


/**
 * Formatted text surfaced within the harness UI.
 */
export default class FormattedText extends React.Component {
  render() {
    return (
      <Markdown
            display={ this.props.display }
            trimIndent={false}
            escapeHtml={true}>
        { this.props.children }
      </Markdown>
    );
  }
}

// API -------------------------------------------------------------------------
FormattedText.propTypes = {
  display: PropTypes.oneOf(["block", "inline-block", "inline"]),
  children: PropTypes.string
};
FormattedText.defaultProps = {
  display: "inline-block",
};

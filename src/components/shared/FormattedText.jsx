import React from 'react';
import Markdown from 'react-atoms/components/Markdown';
import { PropTypes } from '../util';


/**
 * Formatted text surfaced within the harness UI.
 */
export default class FormattedText extends React.Component {
  static propTypes = {
    display: PropTypes.oneOf(['block', 'inline-block', 'inline']),
    children: PropTypes.string,
  };
  static defaultProps = {
    display: 'inline-block',
  };

  render() {
    return (
      <Markdown
        display={ this.props.display }
        trimIndent={ false }
        escapeHtml>
        { this.props.children }
      </Markdown>
    );
  }
}

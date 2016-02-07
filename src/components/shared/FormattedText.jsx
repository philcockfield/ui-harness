import React from 'react';
import { PropTypes } from '../util';
import Markdown from 'react-atoms/components/Markdown';


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

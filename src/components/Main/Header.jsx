import React from 'react';
import Radium, { Style } from 'radium';
import { trimIndent } from 'react-atoms/components/Markdown';
import { css, PropTypes } from '../util';
import { FONT_SANS } from '../GlobalStyles';
import { Markdown } from '../shared';


const elementStyles = (isDark) => {
  const HR_COLOR = isDark
      ? 'rgba(255, 255, 255, 0.4)'
      : 'rgba(0, 0, 0, 0.1)';

  const firstTitle = {
    border: 'none',
    padding: 0,
    margin: 0,
  };
  return css({
    h1: {
      fontSize: 32,
      lineHeight: '40px',
      padding: 0,
      margin: 0,
      fontWeight: 700,
    },
    h2: {
      fontSize: 20,
      lineHeight: '28px',
      padding: 0,
      margin: 0,
      fontWeight: 200,
      borderColor: HR_COLOR,
      borderBottomStyle: 'solid',
      borderBottomWidth: '1px',
      paddingBottom: 8,
      marginBottom: 10,
      marginTop: 30,
    },
    'h2:first-of-type': firstTitle,
    h3: {
      fontSize: 18,
      padding: 0,
      margin: 0,
      marginTop: 30,
    },
    'h3:first-of-type': firstTitle,
    h4: {
      fontSize: 14,
      textTransform: 'uppercase',
      padding: 0,
      margin: 0,
      marginTop: 30,
      opacity: isDark ? 0.6 : 0.4,
    },
    'h5:first-of-type': firstTitle,
    p: {
      fontWeight: 400,
      fontSize: 15,
      lineHeight: '22px',
      marginTop: 0,
      marginBottom: 15,
    },
    ul: {
      fontWeight: 200,
      fontSize: 15,
      lineHeight: '22px',
    },
    hr: {
      borderColor: HR_COLOR,
      marginTop: 20,
      marginBottom: 20,
    },
    'hr:last-child': {
      marginBottom: 0,
    },
    'hr:first-child': {
      marginTop: 0,
      marginBottom: 10,
      borderBottomWidth: 10,
    },
  });
};




/**
 * The Header/Footer bar of the [main] component host.
 */
class Marginal extends React.Component {
  static propTypes = {
    markdown: PropTypes.string,
    hr: PropTypes.bool,
    isDark: PropTypes.bool,
    edge: PropTypes.oneOf(['top', 'bottom']),
  };
  static defaultProps = {
    hr: false,
    isDark: false,
    edge: 'top',
  };

  styles() {
    return css({
      base: {
        paddingTop: 15,
        paddingBottom: 0,
        paddingLeft: 20,
        paddingRight: 20,
        fontFamily: FONT_SANS,
        color: 'rgba(0, 0, 0, 0.5)',
      },
    });
  }

  render() {
    const styles = this.styles();
    let { markdown } = this.props;
    const { hr, isDark } = this.props;
    const removeHR = () => { markdown = markdown.replace(/\n\s*-{3,}\n*$/, ''); };

    // Trim the indent
    // (which may exist if from indented multi-line ES6 template strings).
    const trimmed = trimIndent(markdown);
    markdown = trimmed.text;

    // Append or remove the <HR> at the end of the markdown
    if (markdown) {
      if (hr === true) {
        removeHR(); // Ensure there is only one <HR>.
        const INDENT = ' '.repeat(trimmed.indent);
        markdown = `${ markdown }${ INDENT }\n\n---`;
      }
      if (hr === false) { removeHR(); }
    }

    return (
      <div style={ styles.base } className="uih">
        <div className={ `uih-header uih-markdown ${ this.props.isDark && 'uih-dark' }` }>
          <Style rules={ elementStyles(isDark) } scopeSelector=".uih-header" />
          <Markdown
            display="block"
            trimIndent={ false }
            escapeHtml={ false }>
            { markdown }
          </Markdown>
        </div>
      </div>
    );
  }
}


export default Radium(Marginal);

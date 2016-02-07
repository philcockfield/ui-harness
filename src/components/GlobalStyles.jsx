import React from 'react';
import { Style } from 'radium';

export const FONT_SANS = '"Helvetica Neue", sans-serif';
export const FONT_MONO = 'Menlo, monospace';


/**
 * Common CSS styles.
 */
export default class GlobalStyles extends React.Component {
  render() {
    const rules = {
      code: {
        color: '#c7254e',
        padding: '2px 4px',
        fontSize: '80%',
        fontWeight: 'normal',
        fontFamily: FONT_MONO,
        background: 'rgba(0, 0, 0, 0.02)',
        border: 'solid 1px rgba(0, 0, 0, 0.04)',
        borderRadius: 4,
      },
      pre: {
        background: 'rgba(0, 0, 0, 0.02)',
        border: 'solid 1px rgba(0, 0, 0, 0.04)',
        borderRadius: 4,
        margin: 25,
        padding: 15,
        paddingTop: 10,
        lineHeight: '1.2em',
        fontSize: 14,
      },
      'pre code': {
        background: 'none',
        border: 'none',
      },
      hr: {
        borderTop: 'solid 1px rgba(0, 0, 0, 0.2)',
        borderBottom: 0,
      },

      '.uih-markdown': {
        fontFamily: FONT_SANS,
        lineHeight: '1.8em',
      },

      '.uih-dark': {
        color: 'white',
      },
      '.uih-dark hr': {
        borderColor: 'rgba(255, 255, 255, 0.6)',
      },
      '.uih-dark code': {
        color: 'white',
        background: 'rgba(255, 255, 255, 0.2)',
        borderColor: 'rgba(255, 255, 255, 0.2)',
      },
    };

    return (<Style rules={ rules } scopeSelector=".uih" />);
  }
}

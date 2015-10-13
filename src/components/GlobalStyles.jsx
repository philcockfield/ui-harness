import React from "react";
import { Style } from "radium";

export const FONT_SANS = "'Helvetica Neue', sans-serif";
export const FONT_MONO = "Menlo, monospace";


/**
 * Common CSS styles.
 */
export default class GlobalStyles extends React.Component {
  render() {
    const rules = {
      "code": {
        color: "#c7254e",
        padding: "2px 4px",
        fontSize: "80%",
        fontWeight: "normal",
        fontFamily: FONT_MONO,
        background: "rgba(0, 0, 0, 0.02)",
        border: "solid 1px rgba(0, 0, 0, 0.04)",
        borderRadius: 4
      },
      "pre": {
        background: "rgba(0, 0, 0, 0.02)",
        border: "solid 1px rgba(0, 0, 0, 0.04)",
        borderRadius: 4,
        margin: 25,
        padding: 15,
        paddingTop: 10,
        lineHeight: "1.2em"
      },
      "pre code": {
        background: "none",
        border: "none"
      }
    };

    return (<Style rules={ rules } scopeSelector=".uih" />);
  }
}

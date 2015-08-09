import React from "react";
import { Style } from "radium";
import { FONT_MONO } from "../const";

/**
 * Common CSS styles.
 */
export default class Css extends React.Component {
  render() {
    const rules = {
      code: {
        color: "#c7254e",
        padding: "2px 4px",
        fontSize: 13,
        fontWeight: "normal",
        fontFamily: FONT_MONO,
        background: "rgba(0, 0, 0, 0.02)",
        border: "solid 1px rgba(0, 0, 0, 0.04)",
        borderRadius: 4
      }
    };

    return (<Style rules={ rules } scopeSelector=".uih" />);
  }
}

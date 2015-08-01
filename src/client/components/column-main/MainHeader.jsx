import React from "react";
import Radium from "radium";
import Color from "color";
import { FONT_FAMILY } from "../../const";


/**
 * The header of the [main] component host.
 */
@Radium
export default class MainHeader extends React.Component {
  styles() {
    return {
      base: {
        // background: "rgba(255, 0, 0, 0.1)", //RED
        paddingTop: 15,
        paddingLeft: 20,
        paddingRight: 20,
        fontFamily: FONT_FAMILY
      },
      h1: {
        fontSize: 32,
        lineHeight: '32px',
        padding: 0,
        margin: 0,
        color: Color("white").darken(0.5).hexString(),
        fontWeight: 700
      },
      h2: {
        fontSize: 20,
        lineHeight: '28px',
        padding: 0,
        margin: 0,
        color: Color("white").darken(0.5).hexString(),
        fontWeight: 200
      },
      hr: {
        borderColor: "rgba(0, 0, 0, 0.1)",
        borderBottomStyle: "solid",
        borderBottomWidth: '1px',
        marginTop: 10

      }
    };
  }

  render() {
    const styles = this.styles();
    return (
      <div style={ styles.base }>
        <h1 style={ styles.h1 }>Title</h1>
        <h2 style={ styles.h2 }>Lorem ipsum dolar sit amet.</h2>
        <div style={ styles.hr }/>
      </div>
    );
  }
}

// API -------------------------------------------------------------------------
MainHeader.propTypes = {};
MainHeader.defaultProps = {};

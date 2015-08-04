import React from "react";
import Radium from "radium";
import Immutable from "immutable";
import Color from "color";
import { FONT_FAMILY } from "../../const";
import { FormattedText } from "../shared";


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
        lineHeight: '40px',
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
    const { current } = this.props;
    let title = <FormattedText>{ current.get("title") }</FormattedText>;
    let subtitle = <FormattedText>{ current.get("subtitle") }</FormattedText>;

    return (
      <div style={ styles.base }>
        <h1 style={ styles.h1 }>{ title }</h1>
        <h2 style={ styles.h2 }>{ subtitle }</h2>
        <div style={ styles.hr }/>
      </div>
    );
  }
}

// API -------------------------------------------------------------------------
MainHeader.propTypes = {
  current: React.PropTypes.instanceOf(Immutable.Map).isRequired
};
MainHeader.defaultProps = {};

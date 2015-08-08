import React from "react";
import Radium from "radium";
import Immutable from "immutable";
import Color from "color";
import { css, PropTypes } from "js-util/react";
import { FONT_SANS } from "../../const";
import { Markdown } from "../shared";


/**
 * The header of the [main] component host.
 */
@Radium
export default class MainHeader extends React.Component {
  styles() {
    return css({
      base: {
        background: "rgba(255, 0, 0, 0.1)", //RED
        paddingTop: 15,
        paddingLeft: 20,
        paddingRight: 20,
        fontFamily: FONT_SANS
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
    });
  }

  render() {
    const styles = this.styles();
    const { current } = this.props;
    let title = <Markdown>{ current.get("title") }</Markdown>;
    let subtitle = <Markdown>{ current.get("subtitle") }</Markdown>;

    const LOREM = "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum";
    const paras = (total) => {
          const result = [];
          for (var i = 0; i < total; i++) {
              result.push( <p key={i}>{ LOREM }</p> )
          }
          return result;
        };

    return (
      <div style={ styles.base } className="uih">
        { paras(3) }
      </div>
    );
  }
}

// API -------------------------------------------------------------------------
MainHeader.propTypes = {
  current: PropTypes.instanceOf(Immutable.Map).isRequired
};
MainHeader.defaultProps = {};

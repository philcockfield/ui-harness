import React from "react";
import Radium from "radium";
import Color from "color";
import { css, PropTypes } from "js-util/react";
import { FormattedText, Ellipsis } from "../shared";
import SpecList from "./SpecList";


/**
 * A section of Specs.
 */
@Radium
export default class Section extends React.Component {
  styles() {
    return css({
      base: {},
      titleBar: {
        background: "rgba(0, 0, 0, 0.05)",
        borderTop: "solid 1px rgba(0, 0, 0, 0.04)",
        color: Color("white").darken(0.5).hexString(),
        fontSize: 14,
        padding: "6px 10px",
        marginBottom: 3
      }
    });
  }

  render() {
    const styles = this.styles();
    let { section } = this.props;
    return (
      <div style={ styles.base }>
        <div style={ styles.titleBar }>
          <Ellipsis>
            <FormattedText>{ section.name }</FormattedText>
          </Ellipsis>
        </div>
        <SpecList specs={ section.specs() }/>
      </div>
    );
  }
}

// API -------------------------------------------------------------------------
Section.propTypes = {
  section: PropTypes.object.isRequired,
};
Section.defaultProps = {};

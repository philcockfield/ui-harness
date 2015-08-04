import React from "react";
import Radium from "radium";
import Color from "color";
import { css, PropTypes } from "js-util/react";
import { FormattedText, Ellipsis, Twisty } from "../shared";
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
    let { section, hasOnly } = this.props;
    let specs = section.specs();
    if (hasOnly) { specs = _.filter(specs, spec => spec.isOnly); }

    return (
      <div style={ styles.base }>
        <div style={ styles.titleBar }>
          <Ellipsis>
            <Twisty/>
            <FormattedText>{ section.name }</FormattedText>
          </Ellipsis>
        </div>
        <SpecList specs={ specs }/>
      </div>
    );
  }
}

// API -------------------------------------------------------------------------
Section.propTypes = {
  section: PropTypes.object.isRequired,
  hasOnly: PropTypes.bool,
};
Section.defaultProps = {
  hasOnly: false
};

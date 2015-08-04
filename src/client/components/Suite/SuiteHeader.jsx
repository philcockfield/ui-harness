import React from "react";
import Radium from "radium";
import * as util from "js-util";
import { css, PropTypes } from "js-util/react";
import api from "../../../shared/api-internal";
import Icon from "../shared/Icon";
import Color from "color";
import { FormattedText, Ellipsis } from "../shared";

/**
 * The header bar for the [Suite] index column.
 */
@Radium
export default class SuiteHeader extends React.Component {
  styles() {
    return css({
      base: {
        // background: "rgba(255, 0, 0, 0.1)", //RED
        position: "relative",
        textAlign: "center",
        color: Color("white").darken(0.4).hexString(),
        textShadow: `0px 2px white`,
        fontWeight: 700,
        fontSize: "16px",
        lineHeight: "24px",
        // marginTop: 2,
        paddingBottom: 10,
        borderBottom: `solid 1px rgba(0, 0, 0, 0.08)`,
        paddingLeft: 35,
        paddingRight: 30,
        userSelect: "none",
        cursor: "default"
      }
    });
  }

  handleMenuClick(e) {
    api.indexMode("tree");
  }

  handleRefreshClick(e) {
    console.log("REFRESH"); // TEMP
  }

  render() {
    const styles = this.styles();
    let { suite } = this.props;
    let title = suite.name;

    return (
      <div style={ styles.base }>
        <Icon
            name="menu"
            absolute="0 null null 6"
            onClick={ this.handleMenuClick.bind(this) }
            opacity={ 0.4 }
            cursor="pointer"/>

          <Ellipsis display="block">
            <FormattedText>{ title }</FormattedText>
          </Ellipsis>

        <Icon
            name="refresh"
            absolute="0 6 null null"
            onClick={ this.handleRefreshClick.bind(this) }
            opacity={ 0.4 }
            cursor="pointer"/>

      </div>
    );
  }
}

// API -------------------------------------------------------------------------
SuiteHeader.propTypes = {
  suite: PropTypes.object.isRequired
};
SuiteHeader.defaultProps = {};

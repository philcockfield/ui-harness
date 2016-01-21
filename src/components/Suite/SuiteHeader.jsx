import React from "react";
import Radium from "radium";
import * as util from "js-util";
import { css, PropTypes } from "../util";
import api from "../../shared/api-internal";
import Icon from "../shared/Icon";
import Color from "color";
import { FormattedText, Ellipsis } from "../shared";

/**
 * The header bar for the [Suite] index column.
 */
class SuiteHeader extends React.Component {
  static propTypes = {
    suite: PropTypes.object.isRequired
  };
  static defaultProps = {};

  styles() {
    return css({
      base: {
        position: "relative",
        height: 32,
        borderBottom: `solid 1px rgba(0, 0, 0, 0.08)`,
        cursor: "default"
      },
      titleOuter: {
        Absolute: "-0 32 null 32",
        textAlign: "center",
        color: Color("white").darken(0.4).hexString(),
        textShadow: `0px 1px white`,
        fontWeight: 700,
        fontSize: "16px",
        userSelect: "none"
      }
    });
  }

  handleMenuClick(e) {
    api.indexMode("tree");
  }

  handleRefreshClick(e) {
    api.setCurrent(null);
    api.loadSuite(this.props.suite);
  }

  render() {
    const styles = this.styles();
    let { suite } = this.props;
    let title = suite.name;

    return (
      <div style={ styles.base }>
        <Icon
            name="menu"
            absolute="-2 null null 4"
            onClick={ this.handleMenuClick.bind(this) }
            opacity={ 0.4 }
            cursor="pointer"
            clickOffset={{ y:1 }}/>

        <div style={ styles.titleOuter }>
          <Ellipsis display="block">
            <FormattedText>{ title }</FormattedText>
          </Ellipsis>
        </div>

        <Icon
            name="refresh"
            absolute="-1 6 null null"
            onClick={ this.handleRefreshClick.bind(this) }
            opacity={ 0.4 }
            cursor="pointer"
            clickOffset={{ y:1 }}/>
      </div>
    );
  }
}

export default Radium(SuiteHeader);

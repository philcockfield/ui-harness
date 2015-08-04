import React from "react";
import Radium from "radium";
import { css, PropTypes } from "js-util/react";
import Color from "color";
import { Ellipsis } from "../shared";

/**
 * A single spec within the index list.
 */
@Radium
export default class SpecListItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = { invokeCount: 0 };
  }

  styles() {
    let { invokeCount } = this.state;

    return css({
      base: {
        position: "relative",
        cursor: "pointer",
        background: this.state.isOver ? "rgba(0, 0, 0, 0.03)" : "none",
      },
      name: {
        color: Color("white").darken(0.5).hexString(),
        fontSize: 14,
        lineHeight: "28px",
        paddingLeft: 28,
      },
      bullet: {
        Absolute: "11 null null 13",
        width: 6,
        height: 6,
        background: invokeCount === 0 ? "rgba(0, 0, 0, 0.22)" : "#4A90E2", // BLUE
        borderRadius: 3
      }
    });
  }

  invoke() {
    this.setState({ invokeCount: this.state.invokeCount + 1 })
    console.log("Invoke", this.props.spec); // TODO:
  }

  handleMouseEnter() { this.setState({ isOver:true }); }
  handleMouseLeave() { this.setState({ isOver:false }); }
  handleClick() { this.invoke(); }

  render() {
    const styles = this.styles();
    let { spec } = this.props;
    return (
      <li style={ styles.base }
          onMouseEnter={ this.handleMouseEnter.bind(this) }
          onMouseLeave={ this.handleMouseLeave.bind(this) }
          onClick={ this.handleClick.bind(this) }>

        <div style={ styles.bullet }/>
        <div style={ styles.name }>
          <Ellipsis>{ spec.name }</Ellipsis>
        </div>
      </li>
    );
  }
}

// API -------------------------------------------------------------------------
SpecListItem.propTypes = {
  spec: PropTypes.object.isRequired,
};
SpecListItem.defaultProps = {};

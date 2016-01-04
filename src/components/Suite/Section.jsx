import React from "react";
import Radium from "radium";
import Immutable from "immutable";
import Color from "color";
import { css, PropTypes } from "js-util/react";
import { FormattedText, Ellipsis, Twisty } from "../shared";
import api from "../../shared/api-internal";
import SpecList from "../SpecList";


const isOpenStorage = (section, isOpen) => {
    return api.localStorage(section.id, isOpen, { default:true });
  };


/**
 * A section of Specs.
 */
class Section extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isOpen: isOpenStorage(this.props.section) };
  }

  styles() {
    return css({
      base: {},
      titleBar: {
        background: "rgba(0, 0, 0, 0.05)",
        borderTop: "solid 1px rgba(0, 0, 0, 0.04)",
        color: Color("white").darken(0.5).hexString(),
        fontSize: 14,
        padding: "6px 10px",
        marginBottom: 3,
        cursor: "pointer"
      },
      empty: {
        textAlign: "center",
        fontSize: 13,
        fontStyle: "italic",
        color: css.white.darken(0.3),
        paddingTop: 10,
        paddingBottom: 20
      }
    });
  }

  handleClick() {
    const isOpen = !this.state.isOpen;
    this.setState({ isOpen:isOpen });
    isOpenStorage(this.props.section, isOpen);
  }

  render() {
    const styles = this.styles();
    const { section, hasOnly, current } = this.props;
    const { isOpen } = this.state;
    let specs = section.specs();
    if (hasOnly) { specs = _.filter(specs, spec => spec.isOnly); }

    return (
      <div style={ styles.base }>
        <div style={ styles.titleBar } onClick={ this.handleClick.bind(this) }>
          <Ellipsis>
            <Twisty margin="0 5px 0 0" isOpen={ this.state.isOpen }/>
            <FormattedText>{ section.name }</FormattedText>
          </Ellipsis>
        </div>
        {
          isOpen && specs.length > 0
            ? <SpecList specs={ specs } current={ current }/>
            : null
        }
        {
          isOpen && specs.length === 0
            ? <div style={ styles.empty }>Empty</div>
            : null
        }
      </div>
    );
  }
}

// API -------------------------------------------------------------------------
Section.propTypes = {
  current: PropTypes.instanceOf(Immutable.Map).isRequired,
  section: PropTypes.object.isRequired,
  hasOnly: PropTypes.bool
};
Section.defaultProps = {
  hasOnly: false
};


export default Radium(Section);

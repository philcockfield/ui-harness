import React from "react";
import Radium from "radium";
import { css, PropTypes } from "js-util/react";
import { Ul } from "../shared";
import SpecListItem from "./SpecListItem";


/**
 * A list of specs.
 */
@Radium
export default class SpecList extends React.Component {
  styles() {
    return css({
      base: {
        paddingBottom: 15
      }
    });
  }

  render() {
    const styles = this.styles();
    let specs = this.props.specs.map((spec, i) => {
            return <SpecListItem key={i} spec={ spec }/>
          });

    return (
      <div style={ styles.base }>
        <Ul>{ specs }</Ul>
      </div>
    );
  }
}

// API -------------------------------------------------------------------------
SpecList.propTypes = {
  specs: PropTypes.arrayOf(PropTypes.object)
};
SpecList.defaultProps = {
  specs: []
};

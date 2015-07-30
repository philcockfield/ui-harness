import React from "react";
import Radium from "radium";
import api from "../../api-internal";
import { UL } from "../shared";


/**
 * An <LI> that renders a single [Suite] list item.
 */
@Radium
export default class SuiteItem extends React.Component {
  constructor(props) {
    super(props);
  }

  styles() {
    return {
      base: {
        paddingLeft: 15
      }
    };
  }

  render() {
    const styles = this.styles();
    let { suite } = this.props;

    // Prepare a list of child-suites if they exist.
    let childItems;
    if (suite.childSuites.length > 0) {
      childItems = <UL>
                    { suite.childSuites.map((suite, i) => <SuiteItem key={i} suite={ suite }/>) }
                   </UL>
    }

    return (
      <li style={ styles.base }>
        <div>{ suite.name }</div>
        { childItems }
      </li>
    );
  }
}

// -----------------------------------------------------------------------------
SuiteItem.propTypes = {
  suite: React.PropTypes.object.isRequired,
};
SuiteItem.defaultProps = {};

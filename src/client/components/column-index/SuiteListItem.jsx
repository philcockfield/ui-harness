import React from "react";
import Radium from "radium";
import api from "../../api-internal";
import Color from "color";
import { Ul } from "../shared";
import Twisty from "ui-core/components/Twisty";

const TEXT_COLOR = Color("white").darken(0.5).hexString();

/**
 * An <LI> that renders a single [Suite] list item.
 */
@Radium
export default class SuiteListItem extends React.Component {
  styles() {
    const { index, total, isRoot } = this.props;
    const isFirst = (index === 0);
    const isLast = (index === total - 1);
    return {
      base: {
        paddingLeft: 7,
        fontSize: 14,
        lineHeight: '36px',
        color: TEXT_COLOR,
        borderTop: (isRoot && isFirst ? "" : "solid 1px rgba(0, 0, 0, 0.1)"),
      },
      title: {
        marginLeft: 6
      }
    };
  }

  render() {
    const styles = this.styles();
    let { suite, index, total } = this.props;

    // Prepare a list of child-suites if they exist.
    const totalChildSuites = suite.childSuites.length;
    let childItems;
    if (totalChildSuites > 0) {
      childItems = suite.childSuites.map((suite, i) => {
            return <SuiteListItem key={i}
                      suite={ suite }
                      index={i}
                      total={totalChildSuites}/>
          });
      childItems = <Ul padding='0 0 0 15'>{ childItems }</Ul>
    }

    return (
      <li style={ styles.base }>
        <div>
          <Twisty/>
          <span style={ styles.title }>{ suite.name }</span>

        </div>
        { childItems }
      </li>
    );
  }
}

// -----------------------------------------------------------------------------
SuiteListItem.propTypes = {
  suite: React.PropTypes.object.isRequired,
  index: React.PropTypes.number.isRequired,
  total: React.PropTypes.number.isRequired,
  isRoot: React.PropTypes.bool,
};
SuiteListItem.defaultProps = {
  isRoot: false
};

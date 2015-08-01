import React from "react";
import Radium from "radium";
import util, { color } from "js-util";
import Color from "color";
import api from "../../api-internal";
import { Ul } from "../shared";
import Twisty from "ui-core/components/Twisty";

const TEXT_COLOR = Color("white").darken(0.5).hexString();
const SELECTED_BG_COLOR = color.fromAlpha(-0.08);

// TEMP
// import img from "../../../images/oval.svg";
// console.log("img", img);


/**
 * An <LI> that renders a single [Suite] list item.
 */
@Radium
export default class SuiteListItem extends React.Component {
  componentDidMount() { this.updateWidth(); }
  updateWidth() { this.setState({ width:React.findDOMNode(this).offsetWidth }); }


  styles() {
    const { index, total, isRoot, level } = this.props;
    const { width } = this.state;
    const isFirst = (index === 0);
    const isLast = (index === total - 1);

    let indent = 0;
    if (level > 0) { indent = 15 * level; }

    return {
      base: {
        // backgroundImage: `url(${ img })`,
        borderTop: (isRoot && isFirst ? "" : "dashed 1px rgba(0, 0, 0, 0.1)"),
      },
      itemOuter: {
        width: width ? (width - indent - 7) : "",
        fontSize: 14,
        lineHeight: '36px',
        color: TEXT_COLOR,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        paddingLeft: (7 + indent),
        ":hover": {
          background: color.fromAlpha(-0.02),
          cursor: "pointer"
        }
      },
      itemOuterSelected: {
        background: SELECTED_BG_COLOR,
        ":hover": {
          // NB: Selected item does not present "hover" style.
          background: SELECTED_BG_COLOR,
          cursor: "default"
        }
      },
      title: {
        paddingLeft: 6
      }
    };
  }





  render() {
    const styles = this.styles();
    let { suite, index, total, level } = this.props;

    // TEMP
    const isSelected = this.props.suite.name === 'Bar';

    // Prepare a list of child-suites if they exist.
    const totalChildSuites = suite.childSuites.length;
    let childItems;
    if (totalChildSuites > 0) {
      childItems = suite.childSuites.map((suite, i) => {
            return <SuiteListItem key={i}
                      suite={ suite }
                      index={i}
                      total={ totalChildSuites }
                      level={ level + 1 }/>
          });
      childItems = <Ul>{ childItems }</Ul>
    }

    return (
      <li style={[ styles.base ]}>
        <div className="item-outer"
             style={[ styles.itemOuter, isSelected && styles.itemOuterSelected ]}>

          <Twisty/>
          <span style={ styles.title }>{ suite.name }</span>

        </div>
        { childItems }
      </li>
    );
  }
}

// API -------------------------------------------------------------------------
SuiteListItem.propTypes = {
  suite: React.PropTypes.object.isRequired,
  index: React.PropTypes.number.isRequired,
  total: React.PropTypes.number.isRequired,
  isRoot: React.PropTypes.bool,
  level: React.PropTypes.number,
};
SuiteListItem.defaultProps = {
  isRoot: false,
  level: 0
};

import React from "react";
import Radium from "radium";
import util, { color } from "js-util";
import Color from "color";
import api from "../../api-internal";
import { Ul, Twisty, Center } from "../shared";
import suiteIconSvg from "../../../images/suite-icon.png";

const TEXT_COLOR = Color("white").darken(0.6).hexString();
const SELECTED_BG_COLOR = color.fromAlpha(-0.08);



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
        borderTop: (isRoot && isFirst ? "none" : "dashed 1px rgba(0, 0, 0, 0.1)")
      },
      content: {
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
      contentSelected: {
        background: SELECTED_BG_COLOR,
        ":hover": {
          // NB: Selected item does not present "hover" style.
          background: SELECTED_BG_COLOR,
          cursor: "default"
        }
      },
      title: {
        paddingLeft: 3
      },
      iconOuter: {
        display: "inline-block",
        position: "relative",
        width: 20,
        height: 20,
        top: 5
      },
      suiteIcon: {
        position: "relative",
        backgroundImage: `url(${ suiteIconSvg })`,
        width: 13,
        height: 17
      }
    };
  }





  render() {
    const styles = this.styles();
    const { suite, index, total, level } = this.props;
    const totalChildSuites = suite.childSuites.length;
    const hasChildren = totalChildSuites > 0;

    // TEMP
    const isSelected = this.props.suite.name === 'Bar';

    // Prepare a list of child-suites if they exist.
    let childItems;
    if (hasChildren) {
      childItems = suite.childSuites.map((suite, i) => {
            return <SuiteListItem key={i}
                      suite={ suite }
                      index={i}
                      total={ totalChildSuites }
                      level={ level + 1 }/>
          });
    }

    return (
      <li style={[ styles.base ]}>
        {/* Item content */}
        <div style={[ styles.content, isSelected && styles.contentSelected ]}>
          <div style={ styles.iconOuter }>
            <Center>
              {
                hasChildren
                  ? <Twisty isOpen={ true }/>
                  : <div style={ styles.suiteIcon }/>
              }
            </Center>
          </div>
          <span style={ styles.title }>{ suite.name }</span>
        </div>

        {/* Child suites (RECURSION) */}
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

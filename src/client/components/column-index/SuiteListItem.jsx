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
  constructor(props) {
    super(props);
    this.state = { isOpen: this.props.isOpen };
  }

  componentDidMount() {
    this.updateWidth();
  }

  updateWidth() { this.setState({ width:React.findDOMNode(this).offsetWidth }); }

  styles() {
    const { index, total, isRoot, level } = this.props;
    const { width } = this.state;
    const isFirst = (index === 0);
    const isLast = (index === total - 1);
    const hasChildren = this.hasChildren();

    let indent = 0;
    if (level > 0) { indent = 15 * level; }

    return {
      base: {
        borderTop: (isRoot && isFirst ? "none" : "dashed 1px rgba(0, 0, 0, 0.1)")
      },
      content: {
        position: "relative",
        width: (width ? (width - indent - 7) : ""),
        fontSize: 14,
        lineHeight: '36px',
        color: TEXT_COLOR,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        paddingLeft: (27 + indent),
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
        boxSizing: "border-box",
        position: "absolute",
        left: 7 + indent,
        top: 8,
        paddingLeft: (hasChildren ? 7 : 3),
        paddingTop: (hasChildren ? 5 : 2),
        width: 20,
        height: 20,
      },
      suiteIcon: {
        position: "relative",
        backgroundImage: `url(${ suiteIconSvg })`,
        width: 13,
        height: 17
      }
    };
  }

  hasChildren() { return this.props.suite.childSuites.length > 0 }

  isSelected() {
    const { suite, selectedSuite } = this.props;
    return selectedSuite
              ? (suite.id === selectedSuite.id)
              : false;
  }

  isChildSelected() {
    const { suite, selectedSuite } = this.props;
    if (!selectedSuite) { return false; }
    if (selectedSuite.id.length <= suite.id.length) { return false; }
    return _.startsWith(selectedSuite.id, suite.id);
  }

  toggle(isOpen) {
    if (this.hasChildren()) {
      if (_.isUndefined(isOpen)) { isOpen = !this.state.isOpen; }
      this.setState({ isOpen: isOpen });
    }
  }

  handleClick(e) { this.toggle(); }


  render() {
    const styles = this.styles();
    const { suite, index, total, level, selectedSuite } = this.props;
    const { isOpen } = this.state;
    const totalChildSuites = suite.childSuites.length;
    const hasChildren = totalChildSuites > 0;
    const isSelected = this.isSelected()

    // Prepare a list of child-suites if they exist.
    let childItems;
    if (isOpen && hasChildren) {
      childItems = suite.childSuites.map((suite, i) => {
            return <SuiteListItem key={i}
                      suite={ suite }
                      index={i}
                      total={ totalChildSuites }
                      level={ level + 1 }
                      selectedSuite={ selectedSuite }/>
          });
    }

    return (
      <li style={[ styles.base ]}>
        {/* Item content */}
        <div
            onClick={ this.handleClick.bind(this) }
            style={[ styles.content, isSelected && styles.contentSelected ]}>
          <div style={ styles.iconOuter }>
              {
                hasChildren
                  ? <Twisty isOpen={ isOpen }/>
                  : <div style={ styles.suiteIcon }/>
              }
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
  selectedSuite: React.PropTypes.object,
  isOpen: React.PropTypes.bool,
};
SuiteListItem.defaultProps = {
  isRoot: false,
  level: 0,
  isOpen: false
};

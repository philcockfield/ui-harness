import React from "react";
import Radium from "radium";
import * as util from "js-util";
import { css } from "js-util/react";
import Color from "color";
import api from "../../../shared/api-internal";
import { Ul, Twisty, Center } from "../shared";
import suiteIconSvg1x from "../../../images/suite-icon.png";
import suiteIconSvg2x from "../../../images/suite-icon@2x.png";

const TEXT_COLOR = Color("white").darken(0.6).hexString();
const SELECTED_BG_COLOR = util.color.fromAlpha(-0.08);


/**
 * An <LI> that renders a single [Suite] list item.
 */
@Radium
export default class SuiteListItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isOpen:false, isMounted:false };
  }


  componentDidMount() {
    // Ensure the item is open if a child is selected.
    let isOpen = this.storageIsOpen();
    if (this.isChildSelected()) { isOpen = true; }
    this.toggle(isOpen);

    // Indicate that the component is rendered.
    // NB: Used to prevent <Twisty> from animating on inital load.
    util.delay(() => {
      this.updateWidth();
      this.setState({ isMounted:true });
    });
  }


  updateWidth() {
    this.setState({ width: React.findDOMNode(this).offsetWidth });
  }


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
        borderTop: ((isRoot && isFirst) ? "none" : "solid 1px rgba(0, 0, 0, 0.04)"),
        boxSizing: "border-box"
      },
      content: {
        position: "relative",
        width: (width ? (width - (indent + 27)) : ""), // Set to that ellipsis show.
        fontSize: 14,
        lineHeight: '36px',
        color: TEXT_COLOR,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        paddingLeft: (27 + indent),
        ":hover": {
          background: util.color.fromAlpha(-0.02),
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
        paddingLeft: (hasChildren ? 7 : 4),
        paddingTop: (hasChildren ? 5 : 2),
        width: 20,
        height: 20,
      },
      suiteIcon: css({
        position: "relative",
        Image: [ suiteIconSvg1x, suiteIconSvg2x, 13, 17 ]
      })
    };
  }


  hasChildren() { return this.props.suite.childSuites.length > 0 }


  isSelected() {
      const { suite, selectedSuite } = this.props;
      return selectedSuite
                ? (suite.id === selectedSuite.id)
                : false;
  }


  isCurrent() {
      const currentSuite = api.current.get("suite");
      return (currentSuite && currentSuite.id === this.props.suite.id);
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
        this.storageIsOpen(isOpen);
      }
  }


  storageIsOpen(isOpen) {
      return api.localStorage(`suite-is-open::${ this.props.suite.id }`, isOpen, { default:false });
  }


  handleClick(e) {
      if (this.hasChildren()) {
        this.toggle();
      } else {
        const { suite } = this.props;
        if (this.isCurrent()) {
          // Slide to the "Specs" view.
          suite.meta.thisContext.indexViewMode("specs"); // TEMP
        } else {
          // Load the suite.
          api.loadSuite(suite);
        }
      }
  }


  handleMouseEnter() {
      // Alert parent that the mouse is over the [Suite].
      let { suite, onOverSuite } = this.props;
      onOverSuite({
        suite: (this.hasChildren() ? null : suite),
        toggle: (isOpen) => { this.toggle(isOpen); }
      });
  }


  render() {
    const styles = this.styles();
    const { suite, index, total, level, selectedSuite, onOverSuite } = this.props;
    const { isOpen, isMounted } = this.state;
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
                      selectedSuite={ selectedSuite }
                      onOverSuite={ onOverSuite }/>
          });
    }

    return (
      <li style={[ styles.base ]}
          >

        {/* Item content */}
        <div style={[ styles.content, isSelected && styles.contentSelected ]}
             onMouseDown={ this.handleClick.bind(this) }
             onMouseEnter={ this.handleMouseEnter.bind(this) }>
          <div style={ styles.iconOuter }>
              {
                hasChildren
                  ? <Twisty isOpen={ isOpen } isAnimated={ isMounted }/>
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
  onOverSuite: React.PropTypes.func.isRequired
};
SuiteListItem.defaultProps = {
  isRoot: false,
  level: 0
};

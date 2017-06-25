import React from 'react';
import Radium from 'radium';
import { delay } from 'js-util';
import { fromAlpha } from 'js-util/lib/color';
import { css } from '../util';
import Color from 'color';
import api from '../../shared/api-internal';
import { Ul, Twisty, Ellipsis, IconImage, FormattedText } from '../shared';

const TEXT_COLOR = Color('white').darken(0.6).hexString();
const SELECTED_BG_COLOR = fromAlpha(-0.08);


/**
 * An <LI> that renders a single [Suite] list item.
 */
class SuiteTreeItem extends React.Component {
  static propTypes = {
    suite: React.PropTypes.object.isRequired,
    index: React.PropTypes.number.isRequired,
    total: React.PropTypes.number.isRequired,
    isRoot: React.PropTypes.bool,
    level: React.PropTypes.number,
    selectedSuite: React.PropTypes.object,
    onOverSuite: React.PropTypes.func.isRequired,
    width: React.PropTypes.number.isRequired,
  };
  static defaultProps = {
    isRoot: false,
    level: 0,
  };

  constructor(props) {
    super(props);
    this.state = { isOpen: false, isOver: false, isMounted: false };
  }


  componentDidMount() {
    // Ensure the item is open if a child is selected.
    let isOpen = this.storageIsOpen();
    if (this.isChildSelected()) { isOpen = true; }
    this.toggle(isOpen);

    // Indicate that the component is rendered.
    // NB: Used to prevent <Twisty> from animating on inital load.
    delay(() => this.setState({ isMounted: true }));
  }


  widths() {
    const { level, width } = this.props;
    let indent = 0;
    if (level > 0) { indent = 15 * level; }
    const content = (width ? (width - (indent + 27)) : ''); // Set so that ellipsis show.
    return {
      indent,
      content,
      title: this.isSelected() ? content - 18 : content - 5,
    };
  }


  styles() {
    const { index, isRoot } = this.props;
    const { isOver } = this.state;
    const isFirst = (index === 0);
    const hasChildren = this.hasChildren();
    const widths = this.widths();

    return css({
      base: {
        borderTop: ((isRoot && isFirst) ? 'none' : 'solid 1px rgba(0, 0, 0, 0.04)'),
        boxSizing: 'border-box',
      },
      content: {
        position: 'relative',
        width: widths.content,
        fontSize: 14,
        lineHeight: '36px',
        color: TEXT_COLOR,
        paddingLeft: (27 + widths.indent),
        marginRight: 120,
        ':hover': {
          background: fromAlpha(-0.02),
          cursor: 'pointer',
        },
      },
      contentSelected: {
        background: SELECTED_BG_COLOR,
        ':hover': {
          // NB: Selected item does not present 'hover' style.
          background: SELECTED_BG_COLOR,
        },
      },
      title: {
        position: 'relative',
        display: 'inline-block',
        paddingLeft: 3,
      },
      iconOuter: {
        boxSizing: 'border-box',
        position: 'absolute',
        left: 7 + widths.indent,
        top: 8,
        paddingLeft: (hasChildren ? 7 : 4),
        paddingTop: (hasChildren ? 5 : 2),
        width: 20,
        height: 20,
      },
      drillInIcon: {
        Absolute: '11 5 null null',
        opacity: 0.3,
        transform: isOver ? 'translateX(4px)' : null,
        transition: 'transform 0.15s linear',
      },
    });
  }


  hasChildren() { return this.props.suite.childSuites.length > 0; }


  isSelected() {
    const { suite, selectedSuite } = this.props;
    return selectedSuite
              ? (suite.id === selectedSuite.id)
              : false;
  }


  isCurrent() {
    const currentSuite = api.current.get('suite');
    return (currentSuite && currentSuite.id === this.props.suite.id);
  }


  isChildSelected() {
    const { suite, selectedSuite } = this.props;
    if (!selectedSuite) { return false; }
    if (selectedSuite.id.length <= suite.id.length) { return false; }
    return selectedSuite.id.startsWith(suite.id);
  }


  toggle(isOpen) {
    if (this.hasChildren()) {
      if (isOpen === undefined) { isOpen = !this.state.isOpen; }
      this.setState({ isOpen });
      this.storageIsOpen(isOpen);
    }
  }


  storageIsOpen(isOpen) {
    return api.localStorage(`suite-is-open::${ this.props.suite.id }`, isOpen, { default: false });
  }


  handleClick = () => {
    if (this.hasChildren()) {
      this.toggle();
    } else {
      const { suite } = this.props;
      if (this.isCurrent()) {
        api.indexMode('suite'); // Slide to the 'Suite' view.
      } else {
        api.loadSuite(suite); // Load the suite.
      }
    }
  };

  handleMouseEnter = () => {
    // Alert parent that the mouse is over the [Suite].
    const { suite, onOverSuite } = this.props;
    onOverSuite({
      suite: (this.hasChildren() ? null : suite),
      toggle: (isOpen) => { this.toggle(isOpen); },
    });
    this.setState({ isOver: true });
  };

  handleMouseLeave = () => {
    this.setState({ isOver: false });
  };

  render() {
    const styles = this.styles();
    const { suite, level, selectedSuite, onOverSuite, width } = this.props;
    const { isOpen, isMounted } = this.state;
    const totalChildSuites = suite.childSuites.length;
    const hasChildren = totalChildSuites > 0;
    const isSelected = this.isSelected();
    const widths = this.widths();

    // Prepare selected chrevron pointer.
    let chrevronIcon;
    if (isSelected) {
      chrevronIcon = (
        <div style={ styles.drillInIcon }>
          <IconImage name="chevronRight" />
        </div>
      );
    }

    // Prepare a list of child-suites if they exist.
    let childItems;
    if (isOpen && hasChildren) {
      childItems = suite.childSuites.map((item, i) => (
        <SuiteTreeItemRadium
          key={ i }
          suite={ item }
          index={ i }
          total={ totalChildSuites }
          level={ level + 1 }
          selectedSuite={ selectedSuite }
          onOverSuite={ onOverSuite }
          width={ width } />
      ));

      childItems = <Ul>{ childItems }</Ul>;
    }

    return (
      <li style={ styles.base }>
        { /* Item content */ }
        <div
          style={ [styles.content, isSelected && styles.contentSelected] }
          onClick={ this.handleClick }
          onMouseEnter={ this.handleMouseEnter }
          onMouseLeave={ this.handleMouseLeave }>

          <div style={ styles.iconOuter }>
              {
                hasChildren
                  ? <Twisty isOpen={ isOpen } isAnimated={ isMounted } />
                  : <IconImage name="suiteBook" />
              }
          </div>
          <div style={ styles.title }>
            <Ellipsis width={ widths.title }>
              <FormattedText>{ suite.name }</FormattedText>
            </Ellipsis>
          </div>
          { chrevronIcon }

        </div>

        { /* Child suites (RECURSION) */ }
        { childItems }

      </li>
    );
  }
}

const SuiteTreeItemRadium = Radium(SuiteTreeItem);
export default SuiteTreeItemRadium;

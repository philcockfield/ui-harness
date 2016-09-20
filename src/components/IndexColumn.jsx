import React from 'react';
import Radium from 'radium';
import Immutable from 'immutable';

import { css, PropTypes } from './util';
import api from '../shared/api-internal';
import SuiteTree from './SuiteTree';
import Suite from './Suite';
import { FONT_SANS } from './GlobalStyles';


/**
 * The index column.
 */
class IndexColumn extends React.Component {
  static propTypes = {
    current: PropTypes.instanceOf(Immutable.Map).isRequired,
    width: React.PropTypes.number.isRequired,
  };
  static defaultProps = {};


  componentWillMount() {
    document.addEventListener('keydown', this.handleKeyDown);
  }


  styles() {
    const { width } = this.props;
    const indexMode = api.indexMode();
    let suiteTreeLeft;
    let suiteLeft;

    // Calculate slide position of panels.
    if (indexMode && width) {
      suiteTreeLeft = indexMode === 'tree' ? 0 : (0 - width);
      suiteLeft = indexMode === 'suite' ? 0 : width;
    }

    return css({
      base: {
        Absolute: 0,
        overflow: 'hidden',
        fontFamily: FONT_SANS,
        userSelect: 'none',
      },
      outer: {
        transition: 'transform 0.15s',
      },
      suiteTree: {
        position: 'absolute',
        top: 4,
        bottom: 0,
        left: 0,
        width: '100%',
        transform: `translateX(${ suiteTreeLeft }px)`,
      },
      specs: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        width: '100%',
        transform: `translateX(${ suiteLeft }px)`,
      },
    });
  }


  handleMouseEnter = () => { this.isOver = true; };
  handleMouseLeave = () => { this.isOver = false; };
  handleKeyDown = (e) => {
    if (this.isOver) {
      // Alert child components of the key-event.
      switch (api.indexMode()) {
        case 'tree':
          this.suiteTree.handleKeyDown(e);
          break;

        case 'suite':
          this.suite.handleKeyDown(e);
          break;

        default: // Ignore.
      }
    }
  };


  render() {
    const styles = this.styles();
    const { current, width } = this.props;
    const currentSuite = current.get('suite');
    const indexMode = api.indexMode();

    let elSuite;
    if (currentSuite && indexMode === 'suite') {
      elSuite = (<Suite
        ref={ c => { this.suite = c; } }
        suite={ currentSuite }
        current={ current } />);
    }

    return (
      <div
        style={ styles.base }
        className="uih"
        onMouseEnter={ this.handleMouseEnter }
        onMouseLeave={ this.handleMouseLeave }>

        <div style={ [styles.outer, styles.suiteTree] }>
          <SuiteTree
            ref={ c => { this.suiteTree = c; } }
            selectedSuite={ currentSuite }
            width={ width } />
        </div>
        <div style={ [styles.outer, styles.specs] }>{ elSuite }</div>
      </div>
    );
  }
}

export default Radium(IndexColumn);

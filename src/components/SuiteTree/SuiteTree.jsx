import React from 'react';
import Radium from 'radium';
import api from '../../shared/api-internal';
import bdd from '../../shared/bdd';
import { Ul } from '../shared';
import { css, PropTypes } from '../util';
import SuiteTreeItem from './SuiteTreeItem';
import SuiteTreeEmpty from './SuiteTreeEmpty';


/**
 * The index tree-view of [Suites].
 */
class SuiteTree extends React.Component {
  static propTypes = {
    selectedSuite: PropTypes.object,
    width: PropTypes.number.isRequired,
  };
  static defaultProps = {};

  styles() {
    return css({
      base: {
        Absolute: 0,
        userSelect: 'none',
        overflow: 'hidden',
        overflowY: 'auto',
      },
    });
  }

  handleOverSuite = (e) => { this.mouseOverItem = e; };
  handleMouseLeave = () => { this.mouseOverItem = null; };
  handleKeyDown = (e) => {
    const { selectedSuite } = this.props;
    const item = this.mouseOverItem;
    const suite = item ? item.suite : null;
    if (item) {
      switch (e.which) {
        case 37: // LEFT.
          item.toggle(false);
          break;

        case 39: // RIGHT.
          if (suite) {
            if (selectedSuite && selectedSuite.id === suite.id) {
              api.indexMode('suite'); // Drill into already loaded suite.
            } else {
              api.loadSuite(suite); // Load the new suite.
            }
          } else {
            item.toggle(true);
          }
          break;

        default: // Ignore.
      }
    }
  };


  render() {
    const styles = this.styles();
    const { selectedSuite, width } = this.props;

    // Filter on root suites.
    const suites = bdd.rootSuites();
    const items = suites.map((suite, i) => (
      <SuiteTreeItem
        isRoot
        key={i}
        index={i}
        suite={ suite }
        total={ suites.length }
        selectedSuite={ selectedSuite }
        onOverSuite={ this.handleOverSuite }
        width={ width }/>
    ));

    return (
      <div style={ styles.base }
        onMouseLeave={ this.handleMouseLeave }>
        {
          items.length > 0
            ? <Ul>{ items }</Ul>
            : <SuiteTreeEmpty/>
        }
      </div>
    );
  }
}

export default Radium(SuiteTree);

import R from 'ramda';
import React from 'react';
import Radium from 'radium';
import Immutable from 'immutable';
import { css, PropTypes } from '../util';
import { FlexEdge } from '../shared';
import api from '../../shared/api-internal';
import SuiteHeader from './SuiteHeader';
import SpecList from '../SpecList';
import Section from './Section';
import PropTypesComponent from '../PropTypes';



/**
 * The index-column view a [Suite]'s set of specs.
 */
class Suite extends React.Component {
  static propTypes = {
    current: PropTypes.instanceOf(Immutable.Map).isRequired,
    suite: PropTypes.object.isRequired,
  };
  static defaultProps = {};

  styles(hasPropTypes) {
    return css({
      base: { Absolute: 0 },
      middle: { Absolute: 0 },
      specsList: {
        Absolute: [0, 0, (hasPropTypes ? 27 : 0), 0],
        paddingTop: 6,
        overflow: 'hidden',
        overflowY: 'auto',
      },
      propTypesTitle: {
        Absolute: [null, 0, 0, 0],
        textAlign: 'center',
        fontWeight: 700,
        fontSize: 16,
        textShadow: '0px -1px rgba(0, 0, 0, 0.1)',
        color: '#fff',
        background: '#D1D1D1',
        borderTop: 'solid 1px rgba(0, 0, 0, 0.05)',
        borderBottom: 'solid 1px rgba(0, 0, 0, 0.05)',
        padding: 3,
      },
    });
  }


  handleKeyDown = (e) => {
    switch (e.which) {
      case 37: // LEFT.
        api.indexMode('tree'); // Slide back to the tree-view.
        break;
      default: // Ignore.
    }
  };


  render() {
    const { suite, current } = this.props;
    const hasOnly = R.any(spec => spec.isOnly, suite.specs);
    const componentProps = current.get('componentProps');
    const componentType = current.get('componentType');
    const hasPropTypes = componentType && componentType.propTypes;
    const styles = this.styles(hasPropTypes);
    let sections;

    const specs = R.filter(item => {
      if (item.section) { return false; }
      return hasOnly ? item.isOnly : true;
    }, suite.specs);

    if (suite.sections) {
      const includeSection = (section) => hasOnly
            ? R.any(item => item.isOnly, section.specs())
            : true;
      sections = suite.sections.map((section, i) => {
        if (includeSection(section)) {
          return (<Section
            key={i}
            section={ section }
            hasOnly={ hasOnly }
            current={ current } />);
        }
      });
    }
    return (
      <div style={ styles.base }>
        <FlexEdge orientation="vertical">
          <SuiteHeader suite={ suite }/>
          <div style={ styles.middle } flexEdge={1}>
            <div style={ styles.specsList }>
              <SpecList specs={ specs } current={ current }/>
              { sections }
            </div>
            { hasPropTypes && <div style={ styles.propTypesTitle }>API</div> }
          </div>
          {
            hasPropTypes &&
              <div flexEdge={{
                maxHeight: '50%',
                overflow: 'hidden',
                overflowY: 'auto' }}>
                <PropTypesComponent
                  props={ componentProps }
                  propTypes={ componentType.propTypes }/>
              </div>
          }
        </FlexEdge>
      </div>
    );
  }
}

export default Radium(Suite);

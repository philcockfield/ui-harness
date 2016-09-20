import React from 'react';
import Radium from 'radium';
import Immutable from 'immutable';
import AlignmentContainer from 'react-atoms/components/AlignmentContainer';
import { css, PropTypes } from '../util';
import Component from './Component';

/**
 * The display host for a component under test.
 */
class ComponentHost extends React.Component {
  static propTypes = {
    current: PropTypes.instanceOf(Immutable.Map).isRequired,
  };
  static defaultProps = {};


  styles() {
    const { current } = this.props;
    const margin = current.get('margin');
    return css({
      base: {
        Absolute: [margin, margin, margin, margin],
      },
    });
  }

  render() {
    const styles = this.styles();
    const { current } = this.props;
    const elTools = current.get('tools');

    return (
      <div style={ styles.base }>
        { elTools }
        {
          current.get('componentType') &&
            <AlignmentContainer
              align={ current.get('align') }
              width={ current.get('width') }
              height={ current.get('height') }>
              <Component current={ current } />
            </AlignmentContainer>
        }
      </div>
    );
  }
}



export default Radium(ComponentHost);

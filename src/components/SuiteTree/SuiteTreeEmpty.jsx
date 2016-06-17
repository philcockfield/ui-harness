import React from 'react';
import Radium from 'radium';
import { css } from '../util';
import { IconImage, EmptyLabel } from '../shared';


/**
 * The empty message when no Suites have been declared.
 */
class SuiteTreeEmpty extends React.Component {
  styles() {
    return css({
      base: {
        paddingTop: 20,
        textAlign: 'center',
      },
      icon: {
        marginBottom: 12,
        opacity: 0.1,
      },
    });
  }

  render() {
    const styles = this.styles();
    return (
      <div style={ styles.base }>
        <div style={ styles.icon }>
          <IconImage name="startStar" />
        </div>
        <EmptyLabel>Add some test suites.</EmptyLabel>
      </div>
    );
  }
}


export default Radium(SuiteTreeEmpty);

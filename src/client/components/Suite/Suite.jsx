import _ from "lodash";
import React from "react";
import Radium from "radium";
import { css, PropTypes } from "js-util/react";
import api from "../../../shared/api-internal";
import SuiteHeader from "./SuiteHeader";
import SpecList from "./SpecList";
import Section from "./Section";


/**
 * The index-column view a [Suite]'s set of specs.
 */
@Radium
export default class Suite extends React.Component {
  styles() {
    return css({
      base: {
        Absolute: 0,
      },
      listOuter: {
        Absolute: "35 0 0 0",
        paddingTop: 6,
        overflow: "hidden",
        overflowY: "auto"
      }
    });
  }


  handleKeyDown(e) {
    switch (e.which) {
      case 37: // LEFT.
        api.indexMode("tree"); // Slide back to the tree-view.
        break;
    }
  }


  render() {
    const styles = this.styles();
    let { suite } = this.props;
    let specs = _.filter(suite.specs, (item) => !item.section);

    if (suite.sections) {
      var sections = suite.sections.map((section, i) => {
            return <Section key={i} section={ section }/>
          });
    }

    return (
      <div style={ styles.base }>
        <SuiteHeader suite={ suite }/>
        <div style={ styles.listOuter }>
          <SpecList specs={ specs }/>
          { sections }
        </div>
      </div>
    );
  }
}

// API -------------------------------------------------------------------------
Suite.propTypes = {
  suite: PropTypes.object.isRequired
};
Suite.defaultProps = {};

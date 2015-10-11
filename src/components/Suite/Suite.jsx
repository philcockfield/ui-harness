import _ from "lodash";
import React from "react";
import Radium from "radium";
import Immutable from "immutable";
import { css, PropTypes } from "js-util/react";
import api from "../../shared/api-internal";
import SuiteHeader from "./SuiteHeader";
import SpecList from "../SpecList";
import Section from "./Section";
import FlexEdge from "react-atoms/components/FlexEdge";
import { lorem } from "js-util/test";


/**
 * The index-column view a [Suite]'s set of specs.
 */
@Radium
export default class Suite extends React.Component {
  styles() {
    return css({
      base: {
        Absolute: 0
      },
      listOuter: {
        Absolute: 0,
        paddingTop: 6,
        overflow: "hidden",
        overflowY: "auto"
      },
      propTypesOuter: {
        maxHeight: "50%",
        overflow: "hidden",
        overflowY: "auto",
        borderTop: "solid 5px rgba(0, 0, 0, 0.1)",
        paddingTop: 6
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
    const { suite, current } = this.props;
    const hasOnly = _.any(suite.specs, spec => spec.isOnly);

    let specs = _.filter(suite.specs, (item) => {
          if (item.section) { return false; }
          return hasOnly ? item.isOnly : true;
        });

    if (suite.sections) {
      const includeSection = (section) => {
            return hasOnly
                ? _.any(section.specs(), item => item.isOnly)
                : true;
          };
      var sections = suite.sections.map((section, i) => {
            if (includeSection(section)) {
              return <Section
                        key={i}
                        section={ section }
                        hasOnly={ hasOnly }
                        current={ current }/>
            }
          });
    }


    return (
      <div style={ styles.base }>
        <FlexEdge orientation="vertical">
          <SuiteHeader suite={ suite }/>
          <div style={ styles.listOuter }>
            <SpecList specs={ specs } current={ current }/>
            { sections }
          </div>
          <div style={ styles.propTypesOuter }>
            { lorem(50) }
          </div>
        </FlexEdge>
      </div>
    );
  }
}

// API -------------------------------------------------------------------------
Suite.propTypes = {
  current: PropTypes.instanceOf(Immutable.Map).isRequired,
  suite: PropTypes.object.isRequired
};
Suite.defaultProps = {};

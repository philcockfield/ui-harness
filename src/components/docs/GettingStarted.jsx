import React from "react";
import Radium from "radium";
import Markdown from "react-atoms/components/Markdown";
import { css, PropTypes } from "../util";
import { delay } from "js-util";
import api from "../../shared/api-internal";


const introMarkdown = `
UIHarness uses familiar \`"describe/it"\` testing concepts to rapidly
construct test interfaces around your components as you build them.

    // Visual Spec:

    import React from "react";
    import MyComponent from "../components/MyComponent";

    describe("MyComponent", function() {
      before(() => {
        this.load( <MyComponent color="red" /> );
      });

      it("green", () => this.props({ color: "green" }));
    });

See more [documentation here](https://github.com/philcockfield/ui-harness/blob/master/docs/index.md).
`;




/**
 * A "getting started" introduction.
 */
class GettingStarted extends React.Component {
  styles() {
    return css({
      base: {
        paddingTop: 80,
        paddingBottom: 40,
      },
      content: {
        maxWidth: 550,
        margin: "0 auto",
        padding: "0 50px"
      }
    });
  }


  render() {
    const styles = this.styles();
    return (
      <div className="uih" style={ styles.base }>
        <div className="uih-markdown" style={ styles.content }>
          <div>
            <Markdown>{ introMarkdown }</Markdown>
          </div>
        </div>
      </div>
    );
  }
}


export default Radium(GettingStarted);

import React from "react";
import Radium from "radium";
import Markdown from "react-atoms/components/Markdown";
import { css, PropTypes } from "js-util/react";
import api from "../../shared/api-internal";


const intro = `
UIHarness uses familiar \`"describe/it"\` testing semantics to rapidly
construct test user-interface around your components as you build them.

    import React from "react";
    import MyComponent from "../components/MyComponent";

    describe("MyComponent", function() {
      before(() => {
        this.load( <MyComponent color="red" /> );
      });

      section("color", () => {
        it("red", () => this.props({ color: "red" }));
        it("green", () => this.props({ color: "green" }));
        it("blue", () => this.props({ color: "blue" }));
      });
    });

See this “quick start” example working:
`;




/**
 * A "getting started" introduction.
 */
@Radium
export default class GettingStarted extends React.Component {
  styles() {
    return css({
      base: {
        paddingTop: 40,
        paddingBottom: 40
      },
      content: {
        width: 600,
        margin: "0 auto"
      },
      buttonContainer: {
        paddingTop: 30
      },
      installButton: {
        background: "#35A2E4", // Blue.
        color: "#fff",
        textAlign: "center",
        padding: "20px 40px",
        borderRadius: 5,
        fontWeight: 900,
        fontSize: 18,
        cursor: "pointer",
        ":hover": {
          background: "#2D89C2" // Darker blue.
        }
      }
    });
  }

  handleInstall() {
    api.server.initQuickStart.put("/src")
      .then(result => {
        console.log("result", result); // TEMP
      })
      .catch(err => { throw err });
  }

  render() {
    const styles = this.styles();
    return (
      <div className="uih" style={ styles.base }>
        <div className="markdown" style={ styles.content }>
          <Markdown>{ intro }</Markdown>
          <center style={ styles.buttonContainer }>
            <a
              onClick={ this.handleInstall.bind(this) }
              style={ styles.installButton }>Install Sample</a>
          </center>
        </div>
      </div>
    );
  }
}

// API -------------------------------------------------------------------------
GettingStarted.propTypes = {};
GettingStarted.defaultProps = {};

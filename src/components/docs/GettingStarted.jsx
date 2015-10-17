import React from "react";
import Radium from "radium";
import Markdown from "react-atoms/components/Markdown";
import { css, PropTypes } from "js-util/react";
import api from "../../shared/api-internal";


const intro = `
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

To get started quickly you can copy this sample into your module:
`;




/**
 * A "getting started" introduction.
 */
@Radium
export default class GettingStarted extends React.Component {
  componentWillMount() {
    this.setState({
      buttonLabel: "Install Sample",
      isInstalled: false
    });
  }


  styles() {
    const DISABLED_BG = "rgba(0, 0, 0, 0.15)";

    return css({
      base: {
        paddingTop: 80,
        paddingBottom: 40,
      },
      content: {
        maxWidth: 550,
        margin: "0 auto",
        padding: "0 50px"
      },
      buttonContainer: {
        marginTop: 50,
        display: "block",
        textAlign: "center"
      },
      installButton: {
        display: "inline-block",
        background: "#35A2E4", // Blue.
        ":hover": { background: "#2D89C2" }, // Darker blue.
        color: "#fff",
        textAlign: "center",
        padding: "20px 40px",
        borderRadius: 5,
        fontWeight: 900,
        fontSize: 18,
        cursor: "pointer",
        width: 180
      },
      done: {
        background: DISABLED_BG,
        ":hover": { background: DISABLED_BG },
        cursor: "pointer"
      }
    });
  }


  handleInstall() {
    if (this.state.isInstalled || this.state.isInstalling) { return; }
    this.setState({
      buttonLabel: "Copying Files...",
      isInstalling: true
    })
    api.server.quickStart.put("./src")
      .then(result => {
          this.setState({
            isInstalled: true,
            isInstalling: false,
            buttonLabel: "Done. Reloading..."
          });
      })
      .catch(err => { throw err });
  }


  render() {
    const styles = this.styles();
    const buttonStyles = [styles.installButton];
    if (this.state.isInstalled) {
      buttonStyles.push(styles.done)
    }

    return (
      <div className="uih" style={ styles.base }>
        <div className="markdown" style={ styles.content }>
          <Markdown>{ intro }</Markdown>
          <div style={ styles.buttonContainer }>
            <a
              onClick={ this.handleInstall.bind(this) }
              style={ buttonStyles }>{ this.state.buttonLabel }</a>
          </div>
        </div>
      </div>
    );
  }
}

// API -------------------------------------------------------------------------
GettingStarted.propTypes = {};
GettingStarted.defaultProps = {};

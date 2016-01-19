import React from "react";
import Radium from "radium";
import Markdown from "react-atoms/components/Markdown";
import { css, PropTypes } from "../react-util";
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

To get started quickly you can copy this sample into your module:
`;


const doneMarkdown = `
# Success
A sample React component and it's corresponding ".spec" file has been copied
into your module:

    - <module>
      |-src
        |-components
          |- MyComponent.jsx
        |-specs
          |- MyComponent.spec.jsx

#### Next Steps
- Reload the browser to see it hosted here in the UIHarness.
- Play around with \`MyComponent.jsx\` and \`MyComponent.spec.jsx\` to get a
  feel for how the UIHarness works.
- Start creating glorious UI components of your own.

#### Have Fun!

`;




/**
 * A "getting started" introduction.
 */
class GettingStarted extends React.Component {
  componentWillMount() {
    this.setState({
      buttonLabel: "Install Sample",
      isInstalled: false
    });
  }


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
          // Update visual state.
          this.setState({
            isInstalled: true,
            isInstalling: false
          });
      })
      .catch(err => { throw err });
  }


  render() {
    const styles = this.styles();
    const el = !this.state.isInstalled
      ? <div>
          <Markdown>{ introMarkdown }</Markdown>
          <div style={ styles.buttonContainer }>
            <a
              onClick={ this.handleInstall.bind(this) }
              style={ styles.installButton }>{ this.state.buttonLabel }</a>
          </div>
        </div>
      :
        <div>
          <Markdown>{ doneMarkdown }</Markdown>
        </div>

    return (
      <div className="uih" style={ styles.base }>
        <div className="uih-markdown" style={ styles.content }>{ el }</div>
      </div>
    );
  }
}


export default Radium(GettingStarted);

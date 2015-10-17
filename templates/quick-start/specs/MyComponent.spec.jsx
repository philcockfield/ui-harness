import React from "react";
import MyComponent from "../components/MyComponent";


describe("MyComponent", function() {
  this.header(`## A Simple Component`);
  this.footer(`
  ### Getting Started
  This is a sample React component that has been copied into your module.
  Take a look within the \`/src\` folder to edit the
  \`/components/MyComponent.jsx\` file and it's corresponding **.spec**.

  The "red/green/blue" options on the left are the result of \`"it"\`
  testing statements in the spec file that change the props of the
  hosted component:

      // MyComponent.spec.jsx
      it("red", () => this.props({ color: "red" }));
      it("green", () => this.props({ color: "green" }));
      it("blue", () => this.props({ color: "blue" }));

  Try clicking them.

  At the bottom-left you can see the component's API as defined by it's PropTypes.
  Now, start copying this pattern to add new components and build out your georgous UI!
  For more strategies on using the UIHarness see the [docs](https://github.com/philcockfield/ui-harness/blob/master/docs/index.md).

  `);

  before(() => {
    this.load( <MyComponent color="red"/> );
  });

  it("red", () => this.props({ color: "red" }));
  it("green", () => this.props({ color: "green" }));
  it("blue", () => this.props({ color: "blue" }));
});

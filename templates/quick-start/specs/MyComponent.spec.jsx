import React from "react";
import MyComponent from "../components/MyComponent";


describe("MyComponent", function() {
  this.header(`## A Simple Component.`);

  before(() => {
    this.load( <MyComponent color="red" /> );
  });

  it("red", () => this.props({ color: "red" }));
  it("green", () => this.props({ color: "green" }));
  it("blue", () => this.props({ color: "blue" }));
});

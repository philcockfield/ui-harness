import React from "react";
import Foo from "react-atoms/components/Foo";


describe("PropTypes", function() {
  this.header(`## Renders a visual representation of the PropTypes API.`);

  before(() => {
    this.load( <Foo>Foo</Foo> );
  });

  it("`load`", () => this.load( <Foo>Foo</Foo> ));
  it("`unload`", () => this.unload());
});

import { expect } from "chai";
import React from "react";
import ThisContext from "../../src/shared/ThisContext";
import bdd from "../../src/shared/bdd";
import api from "../../src/shared/api-internal";


class Foo extends React.Component {
  render() {
    return React.createElement("div", this.props, this.props.children);
  }
}



describe("ThisContext: load", () => {
  let self;
  before(() => {
    bdd.reset();
    bdd.register();
  });

  beforeEach(() => {
    api.reset({ hard:true });
    self = new ThisContext();
  });


  it("returns an instance of the [self] context", () => {
    expect(self.load()).to.equal(self);
    expect(self.load(Foo)).to.equal(self);
  });


  describe("Storing Type, Props and Children on the [current] state", () => {
    it("from individual args", () => {
      self.load(Foo, { text: "hello" }, "child");
      expect(api.current.get("componentType")).to.equal(Foo);
      expect(api.current.get("componentProps")).to.eql({ text: "hello" });
      expect(api.current.get("componentChildren")).to.equal("child");
    });

    it("from element", () => {
      let foo = React.createElement(Foo, { text: "hello" }, "child");
      self.load(foo);
      expect(api.current.get("componentType")).to.equal(Foo);
      expect(api.current.get("componentProps")).to.eql({ text: "hello" });
      expect(api.current.get("componentChildren")).to.equal("child");
    });
  });
});

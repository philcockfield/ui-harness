import React from "react";
import Foo from "ui-core/components/Foo";


describe("Component Host", () => {

  before(function() {
    // TODO: invoke automatically on load.

    // this.load( <MyFoo foo='load'><span>Hello</span></MyFoo> )


  });


  it("loads", function() {

    this.load( <MyFoo foo={123}><span>Hello</span></MyFoo> )
    // this.load(Foo, { text:"hello" }, <span>Child</span> );
    // this.load();

  });

  it("does not load", function() {
    console.log("foo");
  });


});



export default class MyFoo extends React.Component {
  render() {
    return (
      <div>{ this.props.children }</div>
    );
  }
}

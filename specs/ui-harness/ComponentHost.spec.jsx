import React from "react";
// import Foo from "ui-core/components/Foo";


describe("Component Host", () => {

  // before(function() {
  //   // TODO: invoke automatically on load.
  //   this.load( <MyFoo foo='load'><span>Hello</span></MyFoo> )
  // });


  section("load", function() {

    it("from `<element>`", function() {
      this.load( <MyFoo foo={123}><span>Hello</span></MyFoo> )
      // this.load();
    });

    it("from `Type`", function() {
      this.load(Foo, { text:"hello" }, <span>Child</span> );
    });

    it("from `<div>`", function() {
      this.load( <div>My Div</div> );
    });
  });



  it("props: now", function() {
    this.props({ foo: new Date().toString() })
  });

  it("change children", function() {
    this.children( <span>New Children</span> )
  });
});



export default class MyFoo extends React.Component {
  render() {
    return (
      <div>
        <div>foo:{ this.props.foo }</div>
        { this.props.children }
      </div>
    );
  }
}

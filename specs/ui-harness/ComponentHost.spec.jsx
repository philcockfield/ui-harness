import React from "react";
// import Foo from "ui-core/components/Foo";


describe("Component Host", () => {

  before(function() {
    // TODO: invoke automatically on load.
    this.load( <MyFoo foo='load'><span>Hello</span></MyFoo> )
  });


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

  section("this.props", function() {
    it("props(now)", function() {
      this.props({ foo: new Date().toString() })
    });
  });


  section("children", function() {
    it("children", function() {
      this.children( <span>New Children { new Date().toString() }</span> )
    });


  });

  section("cropMarks", function() {
    it("read", () => {
      console.log("this.cropMarks()", this.cropMarks());
      console.log("this.cropMarks.size()", this.cropMarks.size());
      console.log("");
    });

    it("`false`", () => {
      console.log("this", this);
      this.cropMarks(false);
    });
    it("`true`", () => { this.cropMarks(true); });

    it("`cropMarks.size: 10`", () => { this.cropMarks.size(10) });
    it("`cropMarks.size: 20`", () => { this.cropMarks.size(20) });
    it("`cropMarks.offset: 0`", () => { this.cropMarks.offset(1) });
    it("`cropMarks.offset: 5`", () => { this.cropMarks.offset(5) });


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

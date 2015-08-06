import React from "react";


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



describe("Component Host", function() {
  before(() => {
    this.load( <MyFoo foo='load'><span>Hello</span></MyFoo> )
  });


  section("load", () => {
    it("from `<element>`", () => {
      this.load( <MyFoo foo={123}><span>Hello</span></MyFoo> )
    });

    it("from `Type`", () => {
      this.load(MyFoo, { text:"hello" }, <span>Child</span> );
    });

    it("from `<div>`", () => {
      this.load( <div>My Div</div> );
    });
  });


  section("this.props", () => {
    it("props(now)", () => {
      this.props({ foo: new Date().toString() })
    });
  });


  section("children", () => {
    it("children", () => {
      this.children( <span>New Children { new Date().toString() }</span> )
    });
  });


  section("cropMarks", () => {
    it("read", () => {
      console.log("cropMarks()", this.cropMarks());
      console.log("cropMarks.size()", this.cropMarks.size());
      console.log("");
    });

    it("`false`", () => { this.cropMarks(false); });
    it("`true`", () => { this.cropMarks(true); });
    it("`cropMarks.size: 10`", () => { this.cropMarks.size(10) });
    it("`cropMarks.size: 20`", () => { this.cropMarks.size(20) });
    it("`cropMarks.offset: 0`", () => { this.cropMarks.offset(1) });
    it("`cropMarks.offset: 5`", () => { this.cropMarks.offset(5) });
  });


  section("size", () => {
    it("read", () => {
      console.log("width()", this.width());
      console.log("height():", this.height());
      console.log("");
    });
    it("`null:null`", () => { this.width(null).height(null) });
    it("`350:200`", () => { this.width(350).height(200) });
    it("`100%:100%`", () => { this.width("100%").height("100%") });
  });
});

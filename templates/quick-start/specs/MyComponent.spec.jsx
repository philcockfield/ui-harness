import React from "react";
import MyComponent from "../components/MyComponent";

describe("MyComponent", function() {
  before(() => {
    this.load( <MyComponent/> );
  });
});

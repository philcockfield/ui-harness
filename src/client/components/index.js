import React from "react";
import rest from "rest-methods/browser";

const server = rest();

server.onReady(() => {


  console.log("initialized");
  console.log("-------------------------------------------");

  server.methods.complex.put("hello", 1)
  .then((result) => { console.log("foo", result); });


});


// TEMP
import Shell from "./Shell";
React.render(React.createElement(Shell), document.body);

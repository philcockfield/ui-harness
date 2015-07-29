console.log("index client");

import rest from "rest-methods/browser";
import components from "./components";

const server = rest();

server.onReady(() => {


  console.log("initialized");
  console.log("-------------------------------------------");

  server.methods.foo.put("hello", 1)
  .then((result) => { console.log("server::foo", result); });


});

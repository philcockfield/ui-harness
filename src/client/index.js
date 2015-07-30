import React from "react";
import bdd from "js-bdd";
import * as api from "./api-internal";


// import rest from "rest-methods/browser";
// const server = rest();
// server.onReady(() => {
//   console.log("initialized");
//   console.log("-------------------------------------------");
//   server.methods.foo.put("hello", 1)
//   .then((result) => { console.log("server::foo", result); });
// });
//


// Put the BDD domain-specific language into the global namespace.
[
  'describe',
  'before',
  'it',
  'section'
].forEach(name => { global[name] = bdd[name] });


// Insert the <Shell> into the root.
api.loadHarness(document.getElementById("page-root"));

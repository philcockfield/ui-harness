import React from "react";
import bdd from "js-bdd";
import Shell from "./components/Shell";


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
const BDD_METHODS = ['describe', 'before', 'it', 'section'];
BDD_METHODS.forEach(name => { global[name] = bdd[name] });


// Insert the <Shell> into the root.
React.render(
  React.createElement(Shell),
  document.getElementById("page-root")
);

/**
 * Main entry point for the UIHarness in the browser.
 */
import React from "react";
import ReactDOM from "react-dom";
import api from "../shared/api-internal";
import bdd from "../shared/bdd";
import Shell from "../components/Shell";
import Main from "../components/Main";


// Ensure the "describe/it" statements are in the global namespace.
bdd.register();


// Render the <Shell> into the DOM.
// api.init(() => {
//     api.shell = ReactDOM.render(
//         React.createElement(Shell, { current: api.current }),
//         document.getElementById("page-root")
//       );
// });


// Connect to the server API.
// const server = rest();
// server.onReady(() => {
//   // Store a reference to the server methods.
//   api.server = server.methods;
//
//   // Render the <Shell> into the DOM.
//   api.init(() => {
//       api.shell = ReactDOM.render(
//           React.createElement(Shell, { current: api.current }),
//           document.getElementById("page-root")
//         );
//   });
// });

console.log("Client!");

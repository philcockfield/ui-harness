/**
 * Main entry point for the browser.
 */
// import R from "ramda";

// import React from "react";
// import ReactDOM from "react-dom";
// import api from "../shared/api-internal";
// import bdd from "../shared/bdd";
// import Shell from "../components/Shell";



// TEMP
const array = [1,2,3];
const mapped = R.map(item => `item-${ item }`, array)
// console.log("R", R);
console.log("mapped", mapped);




// Ensure the "describe/it" statements are in the global namespace.
// bdd.register();


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

console.log("Client!!!");

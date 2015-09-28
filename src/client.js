import React from "react";
import * as util from "js-util";
import api from "./shared/api-internal";
import Shell from "./components/Shell";

// Render the <Shell> into the DOM.
api.init(() => {
    api.shell = React.render(
      React.createElement(Shell, { current: api.current }),
      document.getElementById("page-root"));
});


// import rest from "rest-middleware/browser";
// const server = rest();
// server.onReady(() => {
//   console.log("initialized");
//   console.log("-------------------------------------------");
//   server.methods.foo.put("hello", 1)
//   .then((result) => { console.log("server::foo", result); });
// });
//

// Start the UIHarness server.

// console.log("server specs");
//
// var client = require("../.build/client.bundle.js");
//
// console.log("client", client);
// console.log("-------------------------------------------");
require("../server").start({
    entry: __dirname + "/ui-harness",
    port: 3030
  });


// Start the UIHarness server.
require("./server").start({
    babel: 1,
    entry:  "./src/specs",
    port: 3030
    // env: "production"
  });

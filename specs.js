require("babel/register")({ stage: 1 });

// Start the UIHarness server.
require("./server").start({
    entry:  "./specs",
    port: 3030
    // env: "production"
  });

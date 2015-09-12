require("babel/register")({ stage: 1 });

// Start the UIHarness server.
require("../server").start({
    entry: __dirname + "/specs",
    port: 3030
    // env: "production"
  });

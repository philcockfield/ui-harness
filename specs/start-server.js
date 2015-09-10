// Start the UIHarness server.
require("../src/register-babel");

require("../server").start({
    entry: __dirname + "/ui-harness",
    port: 3030
  });

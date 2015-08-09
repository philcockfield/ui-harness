var harness = require("../../");


harness.namespace("UIHarness", () => {
  require("./ComponentHost.spec");
  require("./header.spec");
  require("./skipped.spec");
})

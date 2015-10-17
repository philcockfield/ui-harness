"use strict"
module.exports = require("./lib/server/middleware");

// Initialize the "quick start" samples if asked to.
if (process.argv.slice(2)[0] === "--samples") {
  var samples = require("./lib/server/rest-service/quick-start");
  samples.copyTemplates();
}

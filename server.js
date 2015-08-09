"use strict"
require("babel/register")({
  stage: 1  // Experimental:level-1
            // Allows for @decorators
            // See: http://babeljs.io/docs/usage/experimental/
            // For example, used by @Radium (CSS)
});
module.exports = require("./src/server");

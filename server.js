"use strict"
require("./config/register-babel");

console.log("server.js | calling ./src/server");

module.exports = require("./src/server");

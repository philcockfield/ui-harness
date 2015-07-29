import React from "react";
import bdd from "js-bdd";
import util from "js-util";


const BDD_METHODS = ['describe', 'before', 'it', 'section'];
BDD_METHODS.forEach(name => { global[name] = bdd[name] });

// TEMP
util.delay(() => {
  console.log("bdd.suites()", bdd.suites());
});



// TEMP
import Shell from "./Shell";
React.render(React.createElement(Shell), document.body);

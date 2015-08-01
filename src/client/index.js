import React from "react";
import bdd from "js-bdd";
import api from "./api-internal";
import util from "js-util";


// import rest from "rest-methods/browser";
// const server = rest();
// server.onReady(() => {
//   console.log("initialized");
//   console.log("-------------------------------------------");
//   server.methods.foo.put("hello", 1)
//   .then((result) => { console.log("server::foo", result); });
// });
//


// Put the BDD domain-specific language into the global namespace.
[
  'describe',
  'before',
  'it',
  'section'
].forEach(name => { global[name] = bdd[name] });


// Insert the <Shell> into the root.
//    NB: Inserted into DOM after delay to ensure that [describe/it]
//        have fully parsed before initial render. Avoids a redraw.
util.delay(() => {

    // TEMP
    api.setCurrent({
      suite: bdd.suites()[2]
    });
    console.log("bdd.suites()[2]", bdd.suites()[2]);
    console.log("api.current.toJS()", api.current.toJS());

    api.init(document.getElementById("page-root"));
});




// TEMP
// ----------------------------------------------------------------------------
// util.delay(1500, () => {
//   api.setCurrent({
//     suite: bdd.suites()[2]
//   });
// });

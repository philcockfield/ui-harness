import rest from "rest-middleware";
import packageJson from "../../package.json";


function foo(p1, p2) {
      // throw new Error("ouch")
      console.log("-------------------------------------------");
      console.log("this", this);
      console.log(this.verb);
      console.log("this.url", this.url);
      console.log("invoked foo!");
      console.log("p1: ", p1);
      console.log("p2: ", p2);
      console.log("");
      return { verb: this.verb, date: new Date() };
}



const service = rest({
  name: "ui-harness",
  basePath: "/api",
  version: packageJson.version
});


// Declare methods API.
service.methods({
  "invokeSpec": {
    put: function(id) {
      console.log("id", id);
      return { id }
    }
  }
});



export default service;

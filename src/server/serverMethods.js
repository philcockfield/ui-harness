import restService from "rest-methods";



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




/**
 * Initializes the server methods.
 * @param {object} options
 *                 - connect: The connect application to use.
 */
export const init = (options = {}) => {

  // Construct the service.
  let server = restService({
    name: "ui-harness",
    connect: options.connect,
    basePath: "/api",
    version: "1.0.0"
  });

  // Declare methods API.
  server.methods({
    "foo": foo
  });
};

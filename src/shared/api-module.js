import bdd from "./bdd";


/**
 * The external API to the UIHarness.
 */
class UIHarness {
  namespace(namespace, invokeWithin) {
    return bdd.namespace(namespace, invokeWithin);
  }
}


// ----------------------------------------------------------------------------
export default new UIHarness();

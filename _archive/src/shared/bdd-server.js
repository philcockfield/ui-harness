import bdd from 'js-bdd';


/**
 * Add an `it.server` extension to the BDD/DSL.
 */
if (!bdd.it.server) {
  bdd.extend.it('server', (spec) => {
    spec.isServer = true;
  });
}

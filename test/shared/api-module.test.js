import { expect } from "chai";
import sinon from "sinon";
import moduleApi from "../../src/shared/api-module";
import api from "../../src/shared/api";
import bdd from "../../src/shared/bdd";



describe("Module API", () => {
  it("exposes the BDD namespace method", () => {
    let fn = () => 0;
    let mock = sinon.mock(bdd);
    mock.expects("namespace").once().withArgs("my-ns", fn);
    moduleApi.namespace("my-ns", fn);
    mock.verify();
    mock.restore();
  });
});

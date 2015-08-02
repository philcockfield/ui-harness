import { expect } from "chai";
import api from "../../src/shared/api-internal";
import Immutable from "immutable";



describe("APIInternal", () => {
  it("has an Immutable map as the [current] state", () => {
    expect(api.current).to.be.an.instanceof(Immutable.Map);
  });
});

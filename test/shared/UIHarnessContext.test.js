import { expect } from "chai";
import UIHarnessContext from "../../src/shared/UIHarnessContext";


describe("UIHarnessContext", () => {
  it("stores type", () => {
    const self = new UIHarnessContext('describe');
    expect(self.type).to.equal('describe');
  });
});

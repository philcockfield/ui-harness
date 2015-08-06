import { expect } from "chai";
import sinon from "sinon";
import api from "../../src/shared/api";
import consoleApi from "../../src/shared/api-console";


describe("console (API)", () => {
  describe("reset()", () => {
    it("not hard (default)", () => {
      const mock = sinon.mock(api);
      mock.expects("reset").once().withArgs({ hard: false });
      consoleApi.reset();
      mock.verify();
      mock.restore();
    });

    it("hard (clears local storage)", () => {
      const mock = sinon.mock(api);
      mock.expects("reset").once().withArgs({ hard: true });
      consoleApi.reset({ hard: true });
      mock.verify();
      mock.restore();
    });
  });
});

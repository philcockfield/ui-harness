import { expect } from 'chai';



if (__UIHARNESS__) {
  describe('Test Folder', function() {
    this.header(`## This Suite Was Loaded from the Mocha Tests Folder`);
  });
}



if (!__UIHARNESS__) {
  describe('Runs within mocha on server', function() {
    it('is not running within the __UIHARNESS__ context', () => {
      expect(true).to.equal(true); // Dummy test, should pass.
    });
  });
}

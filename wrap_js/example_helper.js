/* eslint-disable require-jsdoc */
class Helper {
  constructor() {
    this.cfddlcjsModule = require('../index');
  }

  getResponse(result) {
    return Promise.resolve(result);
  }

  getCfdjs() {
    return this.cfddlcjsModule.getCfddlc();
  }

  initialized(func) {
    this.cfddlcjsModule.addInitializedListener(func);
  }

  hasLoadedWasm() {
    return this.cfddlcjsModule.hasLoadedWasm();
  }
}

module.exports.default = new Helper();

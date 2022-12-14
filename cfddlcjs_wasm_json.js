const cfddlcjsWasm = require('./dist/cfddlcjs_wasm.js');
const cfddlcjsWasmJsonApi = require('./cfddlcjs_wasm_jsonapi.js');
cfddlcjsWasm['preInit'] = function() {};

const wrappedModule = {};
cfddlcjsWasm['onRuntimeInitialized'] = async () => {
  const funcNameResult = await cfddlcjsWasmJsonApi.ccallCfd(
      cfddlcjsWasm,
      cfddlcjsWasm._cfdjsGetJsonApiNames,
      'string',
      [],
      [],
  );
  if (funcNameResult.indexOf('Error:') >= 0) {
    throw new cfddlcjsWasmJsonApi.CfdError(
        `cfdjsGetJsonApiNames internal error. ${funcNameResult}`,
    );
  }
  const funcList = funcNameResult.split(',');

  // register function list
  funcList.forEach((requestName) => {
    const hook = async function(...args) {
      if (args.length > 1) {
        throw new cfddlcjsWasmJsonApi.CfdError(
            'ERROR: Invalid argument passed:' +
            `func=[${requestName}], args=[${args}]`,
        );
      }
      let arg = '';
      if (typeof args === 'undefined') {
        arg = '';
      } else if (typeof args === 'string') {
        arg = args;
      } else if (args) {
        arg = args[0];
      }
      return await cfddlcjsWasmJsonApi.callJsonApi(
          cfddlcjsWasm,
          requestName,
          arg,
      );
    };

    Object.defineProperty(wrappedModule, requestName, {
      value: hook,
      enumerable: true,
    });
  });

  if ('onRuntimeInitialized' in wrappedModule) {
    wrappedModule.onRuntimeInitialized();
  }
};

module.exports = wrappedModule;
module.exports.CfdError = cfddlcjsWasmJsonApi.CfdError;

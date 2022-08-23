import * as cfddlcjs from '../index.js';
import * as cfdjs from 'cfd-js-wasm';
import * as TestData from './__test__/data/TestData';

let loadCount = 0;
const initFunc = async function() {
  if (loadCount === 0) {
    loadCount++;
    return;
  }
  const dlcjsObj = cfddlcjs.getCfddlc();

  {
    console.log('===== CreateCet =====');
    const reqJson: cfddlcjs.CreateCetRequest = {
      localFundPubkey: await TestData.GetLocalFundPubkey(),
      remoteFinalAddress: TestData.RemoteFinalAddress,
      localPayout: TestData.WinAmount,
      remotePayout: TestData.LoseAmount,
      fundTxId: TestData.FundTxId,
      fundVout: 0,
      remoteFundPubkey: await TestData.GetRemoteFundPubkey(),
      localFinalAddress: TestData.LocalFinalAddress,
      lockTime: 0,
    };
    console.log('*** Request ***\n', reqJson);
    const result: cfddlcjs.CreateCetResponse =
      await dlcjsObj.CreateCet(reqJson);
    console.log('\n*** Response ***\n', result, '\n');
  }

  // CreateCet on error
  {
    console.log('\n===== CreateCet (error) =====');
    const reqJson: cfddlcjs.CreateCetRequest = {
      localFundPubkey: '',
      remoteFinalAddress: TestData.RemoteFinalAddress,
      localPayout: TestData.WinAmount,
      remotePayout: TestData.LoseAmount,
      fundTxId: TestData.FundTxId,
      fundVout: 0,
      remoteFundPubkey: '',
      localFinalAddress: TestData.LocalFinalAddress,
      lockTime: 0,
    };
    try {
      console.log('*** Request ***\n', reqJson);
      await dlcjsObj.CreateCet(reqJson);
      console.log('\n*** Error! current route is fail pattern. ***\n');
    } catch (e) {
      if (e instanceof cfddlcjs.CfdError) {
        console.log('receive CfdError. errInfo:', e.getErrorInformation());
      } else {
        console.log('exception type check error.');
        console.log(e);
      }
    }
  }
};
cfddlcjs.addInitializedListener(initFunc);
cfdjs.addInitializedListener(initFunc);

/* eslint-disable require-jsdoc */
import * as cfdjs from 'cfd-js-wasm';

function getCfd() :cfdjs.Cfdjs {
  return cfdjs.getCfd();
}

export async function GetPubkeyFromPrivkey(privkey: string) {
  const reqPrivKey = {
    privkey,
    isCompressed: true,
  };

  return (await getCfd().GetPubkeyFromPrivkey(reqPrivKey)).pubkey;
}

export async function GetSchnorrPubkeyFromPrivkey(privkey: string) {
  const req = {privkey};

  return (await getCfd().GetSchnorrPubkeyFromPrivkey(req)).pubkey;
}

export async function GetExtPubFromExtPriv(extPriv: string) {
  const reqJson = {
    extkey: extPriv,
    network: 'testnet',
  };

  const resp = await getCfd().CreateExtPubkey(reqJson);
  return resp.extkey;
}

export async function GetPrivKeyFromExtPriv(extPriv: string) {
  const reqJson = {
    extkey: extPriv,
    network: 'testnet',
    wif: false,
    isCompressed: true,
  };

  const resp = await getCfd().GetPrivkeyFromExtkey(reqJson);
  return resp.privkey;
}

export async function GetPubkeyFromExtPriv(extPriv: string) {
  const priv = await GetPrivKeyFromExtPriv(extPriv);
  return await GetPubkeyFromPrivkey(priv);
}

export async function
GetChildPrivKeyFromExtPriv(extPriv: string, index: number) {
  const reqJson: cfdjs.CreateExtkeyFromParentPathRequest = {
    extkey: extPriv,
    network: 'regtest',
    path: `m/0/${index}`,
    extkeyType: 'extPrivkey',
    childNumberArray: [],
  };
  const extChild = (await getCfd().CreateExtkeyFromParentPath(reqJson)).extkey;

  const reqJson2: cfdjs.GetPrivkeyFromExtkeyRequest = {
    extkey: extChild,
    network: 'regtest',
    wif: false,
    isCompressed: false,
  };

  const priv = (await getCfd().GetPrivkeyFromExtkey(reqJson2)).privkey;
  return priv;
}

export async function GetAddressFromPubkey(pubkey: string) {
  const data: cfdjs.HashKeyData = {
    hex: pubkey,
    type: 'pubkey',
  };
  const reqJson: cfdjs.CreateAddressRequest = {
    isElements: false,
    keyData: data,
    network: 'regtest',
    hashType: 'p2wpkh',
  };

  return (await getCfd().CreateAddress(reqJson)).address;
}

export async function GetPrivkeyFromWif(wif: string) {
  const req = {
    wif,
  };

  return (await getCfd().GetPrivkeyFromWif(req)).hex;
}

export async function DecodeRawTransaction(
    rawTransaction: string,
): Promise<cfdjs.DecodeRawTransactionResponse> {
  const reqJson: cfdjs.DecodeRawTransactionRequest = {
    hex: rawTransaction,
  };

  const resp = await getCfd().DecodeRawTransaction(reqJson);
  return resp;
}

export async function CreateKeyPair() {
  const reqJson: cfdjs.CreateKeyPairRequest = {
    wif: false,
  };
  return await getCfd().CreateKeyPair(reqJson);
}

export async function SchnorrSign(
    message: string,
    privkey: string,
    nonceOrAux: string,
    isHashed = false,
    isNonce = true,
) {
  const req: cfdjs.SchnorrSignRequest = {
    privkey,
    message,
    nonceOrAux,
    isNonce,
    isHashed,
  };

  return (await getCfd().SchnorrSign(req)).hex;
}

export async function SchnorrVerify(
    message: string,
    signature: string,
    pubkey: string,
) {
  const req = {
    message,
    signature,
    pubkey,
  };

  return (await getCfd().SchnorrVerify(req)).valid;
}

export async function GetAddressScript(address: string) {
  const req = {address};

  const info = await getCfd().GetAddressInfo(req);
  return info.lockingScript;
}

export async function ParseAsmScript(input: string) {
  const items = [input];
  const req = {
    items,
  };
  return (await getCfd().CreateScript(req)).hex;
}

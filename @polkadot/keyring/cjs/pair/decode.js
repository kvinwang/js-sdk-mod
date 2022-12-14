"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.decodePair = decodePair;
var _util = require("@polkadot/util");
var _utilCrypto = require("@polkadot/util-crypto");
var _defaults = require("./defaults");
// Copyright 2017-2022 @polkadot/keyring authors & contributors
// SPDX-License-Identifier: Apache-2.0

const SEED_OFFSET = _defaults.PKCS8_HEADER.length;
function decodePair(passphrase, encrypted, _encType) {
  const encType = Array.isArray(_encType) || _encType === undefined ? _encType : [_encType];
  const decrypted = (0, _utilCrypto.jsonDecryptData)(encrypted, passphrase, encType);
  const header = decrypted.subarray(0, _defaults.PKCS8_HEADER.length);
  if (!(0, _util.u8aEq)(header, _defaults.PKCS8_HEADER)) {
    throw new Error('Invalid Pkcs8 header found in body');
  }
  let secretKey = decrypted.subarray(SEED_OFFSET, SEED_OFFSET + _defaults.SEC_LENGTH);
  let divOffset = SEED_OFFSET + _defaults.SEC_LENGTH;
  let divider = decrypted.subarray(divOffset, divOffset + _defaults.PKCS8_DIVIDER.length);

  // old-style, we have the seed here
  if (!(0, _util.u8aEq)(divider, _defaults.PKCS8_DIVIDER)) {
    divOffset = SEED_OFFSET + _defaults.SEED_LENGTH;
    secretKey = decrypted.subarray(SEED_OFFSET, divOffset);
    divider = decrypted.subarray(divOffset, divOffset + _defaults.PKCS8_DIVIDER.length);
    if (!(0, _util.u8aEq)(divider, _defaults.PKCS8_DIVIDER)) {
      throw new Error('Invalid Pkcs8 divider found in body');
    }
  }
  const pubOffset = divOffset + _defaults.PKCS8_DIVIDER.length;
  const publicKey = decrypted.subarray(pubOffset, pubOffset + _defaults.PUB_LENGTH);
  return {
    publicKey,
    secretKey
  };
}
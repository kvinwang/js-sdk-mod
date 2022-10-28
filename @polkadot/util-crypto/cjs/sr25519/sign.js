"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sr25519Sign = sr25519Sign;

var _util = require("@polkadot/util");

var _wasmCrypto = require("@polkadot/wasm-crypto");

// Copyright 2017-2022 @polkadot/util-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

/**
 * @name sr25519Sign
 * @description Returns message signature of `message`, using the supplied pair
 */
function sr25519Sign(message, _ref) {
  let {
    publicKey,
    secretKey
  } = _ref;

  if ((publicKey === null || publicKey === void 0 ? void 0 : publicKey.length) !== 32) {
    throw new Error('Expected a valid publicKey, 32-bytes');
  } else if ((secretKey === null || secretKey === void 0 ? void 0 : secretKey.length) !== 64) {
    throw new Error('Expected a valid secretKey, 64-bytes');
  }

  return (0, _wasmCrypto.sr25519Sign)(publicKey, secretKey, (0, _util.u8aToU8a)(message));
}
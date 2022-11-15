"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sr25519Agreement = sr25519Agreement;
var _util = require("@polkadot/util");
var _wasmCrypto = require("@polkadot/wasm-crypto");
// Copyright 2017-2022 @polkadot/util-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

/**
 * @name sr25519Agreement
 * @description Key agreement between other's public key and self secret key
 */
function sr25519Agreement(secretKey, publicKey) {
  const secretKeyU8a = (0, _util.u8aToU8a)(secretKey);
  const publicKeyU8a = (0, _util.u8aToU8a)(publicKey);
  if (publicKeyU8a.length !== 32) {
    throw new Error(`Invalid publicKey, received ${publicKeyU8a.length} bytes, expected 32`);
  } else if (secretKeyU8a.length !== 64) {
    throw new Error(`Invalid secretKey, received ${secretKeyU8a.length} bytes, expected 64`);
  }
  return (0, _wasmCrypto.sr25519Agree)(publicKeyU8a, secretKeyU8a);
}
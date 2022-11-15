"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sr25519DerivePublic = sr25519DerivePublic;
var _util = require("@polkadot/util");
var _wasmCrypto = require("@polkadot/wasm-crypto");
// Copyright 2017-2022 @polkadot/util-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

function sr25519DerivePublic(publicKey, chainCode) {
  const publicKeyU8a = (0, _util.u8aToU8a)(publicKey);
  if (!(0, _util.isU8a)(chainCode) || chainCode.length !== 32) {
    throw new Error('Invalid chainCode passed to derive');
  } else if (publicKeyU8a.length !== 32) {
    throw new Error(`Invalid publicKey, received ${publicKeyU8a.length} bytes, expected 32`);
  }
  return (0, _wasmCrypto.sr25519DerivePublicSoft)(publicKeyU8a, chainCode);
}
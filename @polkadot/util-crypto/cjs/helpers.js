"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createAsHex = createAsHex;
exports.createBitHasher = createBitHasher;
exports.createDualHasher = createDualHasher;
var _util = require("@polkadot/util");
var _wasmCrypto = require("@polkadot/wasm-crypto");
// Copyright 2017-2022 @polkadot/util-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

/** @internal */
function createAsHex(fn) {
  return function () {
    return (0, _util.u8aToHex)(fn(...arguments));
  };
}

/** @internal */
function createBitHasher(bitLength, fn) {
  return (data, onlyJs) => fn(data, bitLength, onlyJs);
}

/** @internal */
function createDualHasher(wa, js) {
  return function (value) {
    let bitLength = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 256;
    let onlyJs = arguments.length > 2 ? arguments[2] : undefined;
    const u8a = (0, _util.u8aToU8a)(value);
    return !_util.hasBigInt || !onlyJs && (0, _wasmCrypto.isReady)() ? wa[bitLength](u8a) : js[bitLength](u8a);
  };
}
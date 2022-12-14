"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.u64 = void 0;
var _UInt = require("../base/UInt");
// Copyright 2017-2022 @polkadot/types-codec authors & contributors
// SPDX-License-Identifier: Apache-2.0

/**
 * @name u64
 * @description
 * A 64-bit unsigned integer
 */
class u64 extends _UInt.UInt.with(64) {
  // NOTE without this, we cannot properly determine extensions
  __UIntType = 'u64';
}
exports.u64 = u64;
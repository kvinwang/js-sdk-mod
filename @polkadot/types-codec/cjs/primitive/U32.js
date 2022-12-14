"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.u32 = void 0;
var _UInt = require("../base/UInt");
// Copyright 2017-2022 @polkadot/types-codec authors & contributors
// SPDX-License-Identifier: Apache-2.0

/**
 * @name u32
 * @description
 * A 32-bit unsigned integer
 */
class u32 extends _UInt.UInt.with(32) {
  // NOTE without this, we cannot properly determine extensions
  __UIntType = 'u32';
}
exports.u32 = u32;
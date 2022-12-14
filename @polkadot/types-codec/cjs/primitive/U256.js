"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.u256 = void 0;
var _UInt = require("../base/UInt");
// Copyright 2017-2022 @polkadot/types-codec authors & contributors
// SPDX-License-Identifier: Apache-2.0

/**
 * @name u256
 * @description
 * A 256-bit unsigned integer
 */
class u256 extends _UInt.UInt.with(256) {
  // NOTE without this, we cannot properly determine extensions
  __UIntType = 'u256';
}
exports.u256 = u256;
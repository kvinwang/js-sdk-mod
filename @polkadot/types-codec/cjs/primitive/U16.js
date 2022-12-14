"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.u16 = void 0;
var _UInt = require("../base/UInt");
// Copyright 2017-2022 @polkadot/types-codec authors & contributors
// SPDX-License-Identifier: Apache-2.0

/**
 * @name u16
 * @description
 * A 16-bit unsigned integer
 */
class u16 extends _UInt.UInt.with(16) {
  // NOTE without this, we cannot properly determine extensions
  __UIntType = 'u16';
}
exports.u16 = u16;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.i32 = void 0;
var _Int = require("../base/Int");
// Copyright 2017-2022 @polkadot/types-codec authors & contributors
// SPDX-License-Identifier: Apache-2.0

/**
 * @name i32
 * @description
 * A 32-bit signed integer
 */
class i32 extends _Int.Int.with(32) {
  // NOTE without this, we cannot properly determine extensions
  __IntType = 'i32';
}
exports.i32 = i32;
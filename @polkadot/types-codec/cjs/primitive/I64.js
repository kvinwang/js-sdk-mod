"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.i64 = void 0;
var _Int = require("../base/Int");
// Copyright 2017-2022 @polkadot/types-codec authors & contributors
// SPDX-License-Identifier: Apache-2.0

/**
 * @name i64
 * @description
 * A 64-bit signed integer
 */
class i64 extends _Int.Int.with(64) {
  // NOTE without this, we cannot properly determine extensions
  __IntType = 'i64';
}
exports.i64 = i64;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.i128 = void 0;
var _Int = require("../base/Int");
// Copyright 2017-2022 @polkadot/types-codec authors & contributors
// SPDX-License-Identifier: Apache-2.0

/**
 * @name i128
 * @description
 * A 128-bit signed integer
 */
class i128 extends _Int.Int.with(128) {
  // NOTE without this, we cannot properly determine extensions
  __IntType = 'i128';
}
exports.i128 = i128;
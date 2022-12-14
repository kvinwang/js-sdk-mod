"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.i16 = void 0;
var _Int = require("../base/Int");
// Copyright 2017-2022 @polkadot/types-codec authors & contributors
// SPDX-License-Identifier: Apache-2.0

/**
 * @name i16
 * @description
 * A 16-bit signed integer
 */
class i16 extends _Int.Int.with(16) {
  // NOTE without this, we cannot properly determine extensions
  __IntType = 'i16';
}
exports.i16 = i16;
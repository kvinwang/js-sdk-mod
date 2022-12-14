"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.i8 = void 0;
var _Int = require("../base/Int");
// Copyright 2017-2022 @polkadot/types-codec authors & contributors
// SPDX-License-Identifier: Apache-2.0

/**
 * @name i8
 * @description
 * An 8-bit signed integer
 */
class i8 extends _Int.Int.with(8) {
  // NOTE without this, we cannot properly determine extensions
  __IntType = 'i8';
}
exports.i8 = i8;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.i256 = void 0;
var _Int = require("../base/Int");
// Copyright 2017-2022 @polkadot/types-codec authors & contributors
// SPDX-License-Identifier: Apache-2.0

/**
 * @name i256
 * @description
 * A 256-bit signed integer
 */
class i256 extends _Int.Int.with(256) {
  // NOTE without this, we cannot properly determine extensions
  __IntType = 'i256';
}
exports.i256 = i256;
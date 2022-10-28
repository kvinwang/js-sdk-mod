"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isBuffer = isBuffer;

var _has = require("../has");

var _function = require("./function");

// Copyright 2017-2022 @polkadot/util authors & contributors
// SPDX-License-Identifier: Apache-2.0

/**
 * @name isBuffer
 * @summary Tests for a `Buffer` object instance.
 * @description
 * Checks to see if the input object is an instance of `Buffer`.
 * @example
 * <BR>
 *
 * ```javascript
 * import { isBuffer } from '@polkadot/util';
 *
 * console.log('isBuffer', isBuffer(Buffer.from([]))); // => true
 * ```
 */
function isBuffer(value) {
  // we do check a function first, since it is slightly faster than isBuffer itself
  return _has.hasBuffer && (0, _function.isFunction)(value && value.readDoubleLE) && Buffer.isBuffer(value);
}
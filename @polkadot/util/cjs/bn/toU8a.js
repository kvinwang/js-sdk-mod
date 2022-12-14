"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bnToU8a = bnToU8a;
var _toBn = require("./toBn");
// Copyright 2017-2022 @polkadot/util authors & contributors
// SPDX-License-Identifier: Apache-2.0

const DEFAULT_OPTS = {
  bitLength: -1,
  isLe: true,
  isNegative: false
};

/**
 * @name bnToU8a
 * @summary Creates a Uint8Array object from a BN.
 * @description
 * `null`/`undefined`/`NaN` inputs returns an empty `Uint8Array` result. `BN` input values return the actual bytes value converted to a `Uint8Array`. Optionally convert using little-endian format if `isLE` is set.
 * @example
 * <BR>
 *
 * ```javascript
 * import { bnToU8a } from '@polkadot/util';
 *
 * bnToU8a(new BN(0x1234)); // => [0x12, 0x34]
 * ```
 */
function bnToU8a(value) {
  let {
    bitLength = -1,
    isLe = true,
    isNegative = false
  } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DEFAULT_OPTS;
  const valueBn = (0, _toBn.bnToBn)(value);
  const byteLength = bitLength === -1 ? Math.ceil(valueBn.bitLength() / 8) : Math.ceil((bitLength || 0) / 8);
  if (!value) {
    return bitLength === -1 ? new Uint8Array(1) : new Uint8Array(byteLength);
  }
  const output = new Uint8Array(byteLength);
  const bn = isNegative ? valueBn.toTwos(byteLength * 8) : valueBn;
  output.set(bn.toArray(isLe ? 'le' : 'be', byteLength), 0);
  return output;
}
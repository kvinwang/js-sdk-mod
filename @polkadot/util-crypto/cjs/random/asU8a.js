"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.randomAsHex = void 0;
exports.randomAsU8a = randomAsU8a;
var _xRandomvalues = require("@polkadot/x-randomvalues");
var _helpers = require("../helpers");
// Copyright 2017-2022 @polkadot/util-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

/**
 * @name randomAsU8a
 * @summary Creates a Uint8Array filled with random bytes.
 * @description
 * Returns a `Uint8Array` with the specified (optional) length filled with random bytes.
 * @example
 * <BR>
 *
 * ```javascript
 * import { randomAsU8a } from '@polkadot/util-crypto';
 *
 * randomAsU8a(); // => Uint8Array([...])
 * ```
 */
function randomAsU8a() {
  let length = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 32;
  return (0, _xRandomvalues.getRandomValues)(new Uint8Array(length));
}

/**
 * @name randomAsHex
 * @description Creates a hex string filled with random bytes.
 */
const randomAsHex = (0, _helpers.createAsHex)(randomAsU8a);
exports.randomAsHex = randomAsHex;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ed25519PairFromRandom = ed25519PairFromRandom;
var _random = require("../../random");
var _fromSeed = require("./fromSeed");
// Copyright 2017-2022 @polkadot/util-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

/**
 * @name ed25519PairFromRandom
 * @summary Creates a new public/secret keypair.
 * @description
 * Returns a new generate object containing a `publicKey` & `secretKey`.
 * @example
 * <BR>
 *
 * ```javascript
 * import { ed25519PairFromRandom } from '@polkadot/util-crypto';
 *
 * ed25519PairFromRandom(); // => { secretKey: [...], publicKey: [...] }
 * ```
 */
function ed25519PairFromRandom() {
  return (0, _fromSeed.ed25519PairFromSeed)((0, _random.randomAsU8a)());
}
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mnemonicGenerate = mnemonicGenerate;
var _util = require("@polkadot/util");
var _wasmCrypto = require("@polkadot/wasm-crypto");
var _bip = require("./bip39");
// Copyright 2017-2022 @polkadot/util-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

/**
 * @name mnemonicGenerate
 * @summary Creates a valid mnemonic string using using [BIP39](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki).
 * @example
 * <BR>
 *
 * ```javascript
 * import { mnemonicGenerate } from '@polkadot/util-crypto';
 *
 * const mnemonic = mnemonicGenerate(); // => string
 * ```
 */
function mnemonicGenerate() {
  let numWords = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 12;
  let onlyJs = arguments.length > 1 ? arguments[1] : undefined;
  return !_util.hasBigInt || !onlyJs && (0, _wasmCrypto.isReady)() ? (0, _wasmCrypto.bip39Generate)(numWords) : (0, _bip.generateMnemonic)(numWords);
}
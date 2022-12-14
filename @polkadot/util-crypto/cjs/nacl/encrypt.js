"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.naclEncrypt = naclEncrypt;
var _tweetnacl = _interopRequireDefault(require("tweetnacl"));
var _asU8a = require("../random/asU8a");
// Copyright 2017-2022 @polkadot/util-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

/**
 * @name naclEncrypt
 * @summary Encrypts a message using the supplied secretKey and nonce
 * @description
 * Returns an encrypted message, using the `secretKey` and `nonce`. If the `nonce` was not supplied, a random value is generated.
 * @example
 * <BR>
 *
 * ```javascript
 * import { naclEncrypt } from '@polkadot/util-crypto';
 *
 * naclEncrypt([...], [...]); // => [...]
 * ```
 */
function naclEncrypt(message, secret) {
  let nonce = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : (0, _asU8a.randomAsU8a)(24);
  return {
    encrypted: _tweetnacl.default.secretbox(message, nonce, secret),
    nonce
  };
}
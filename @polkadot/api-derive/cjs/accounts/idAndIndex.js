"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.idAndIndex = idAndIndex;
var _rxjs = require("rxjs");
var _util = require("@polkadot/util");
var _utilCrypto = require("@polkadot/util-crypto");
var _util2 = require("../util");
// Copyright 2017-2022 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

/**
 * @name idAndIndex
 * @param {(Address | AccountId | AccountIndex | Uint8Array | string | null)} address - An accounts address in various formats.
 * @description  An array containing the [[AccountId]] and [[AccountIndex]] as optional values.
 * @example
 * <BR>
 *
 * ```javascript
 * api.derive.accounts.idAndIndex('F7Hs', ([id, ix]) => {
 *   console.log(`AccountId #${id} with corresponding AccountIndex ${ix}`);
 * });
 * ```
 */
function idAndIndex(instanceId, api) {
  return (0, _util2.memo)(instanceId, address => {
    try {
      // yes, this can fail, don't care too much, catch will catch it
      const decoded = (0, _util.isU8a)(address) ? address : (0, _utilCrypto.decodeAddress)((address || '').toString());
      if (decoded.length > 8) {
        const accountId = api.registry.createType('AccountId', decoded);
        return api.derive.accounts.idToIndex(accountId).pipe((0, _rxjs.map)(accountIndex => [accountId, accountIndex]));
      }
      const accountIndex = api.registry.createType('AccountIndex', decoded);
      return api.derive.accounts.indexToId(accountIndex.toString()).pipe((0, _rxjs.map)(accountId => [accountId, accountIndex]));
    } catch (error) {
      return (0, _rxjs.of)([undefined, undefined]);
    }
  });
}
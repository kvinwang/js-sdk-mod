"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.indexToId = indexToId;
var _rxjs = require("rxjs");
var _util = require("../util");
// Copyright 2017-2022 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

/**
 * @name indexToId
 * @param {( AccountIndex | string )} accountIndex - An accounts index in different formats.
 * @returns Returns the corresponding AccountId.
 * @example
 * <BR>
 *
 * ```javascript
 * api.derive.accounts.indexToId('F7Hs', (accountId) => {
 *   console.log(`The AccountId of F7Hs is ${accountId}`);
 * });
 * ```
 */
function indexToId(instanceId, api) {
  return (0, _util.memo)(instanceId, accountIndex => api.query.indices ? api.query.indices.accounts(accountIndex).pipe((0, _rxjs.map)(optResult => optResult.unwrapOr([])[0])) : (0, _rxjs.of)(undefined));
}
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.indexes = indexes;
var _rxjs = require("rxjs");
var _util = require("../util");
// Copyright 2017-2022 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

let indicesCache = null;
function queryAccounts(api) {
  return api.query.indices.accounts.entries().pipe((0, _rxjs.map)(entries => entries.reduce((indexes, _ref) => {
    let [key, idOpt] = _ref;
    if (idOpt.isSome) {
      indexes[idOpt.unwrap()[0].toString()] = api.registry.createType('AccountIndex', key.args[0]);
    }
    return indexes;
  }, {})));
}

/**
 * @name indexes
 * @returns Returns all the indexes on the system.
 * @description This is an unwieldly query since it loops through
 * all of the enumsets and returns all of the values found. This could be up to 32k depending
 * on the number of active accounts in the system
 * @example
 * <BR>
 *
 * ```javascript
 * api.derive.accounts.indexes((indexes) => {
 *   console.log('All existing AccountIndexes', indexes);
 * });
 * ```
 */
function indexes(instanceId, api) {
  return (0, _util.memo)(instanceId, () => indicesCache ? (0, _rxjs.of)(indicesCache) : (api.query.indices ? queryAccounts(api).pipe((0, _rxjs.startWith)({})) : (0, _rxjs.of)({})).pipe((0, _rxjs.map)(indices => {
    indicesCache = indices;
    return indices;
  })));
}
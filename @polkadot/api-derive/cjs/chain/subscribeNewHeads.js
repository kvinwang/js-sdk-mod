"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.subscribeNewHeads = subscribeNewHeads;
var _rxjs = require("rxjs");
var _type = require("../type");
var _util = require("../util");
var _util2 = require("./util");
// Copyright 2017-2022 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

/**
 * @name subscribeNewHeads
 * @returns A header with the current header (including extracted author)
 * @description An observable of the current block header and it's author
 * @example
 * <BR>
 *
 * ```javascript
 * api.derive.chain.subscribeNewHeads((header) => {
 *   console.log(`block #${header.number} was authored by ${header.author}`);
 * });
 * ```
 */
function subscribeNewHeads(instanceId, api) {
  return (0, _util.memo)(instanceId, () => api.rpc.chain.subscribeNewHeads().pipe((0, _rxjs.switchMap)(header => (0, _rxjs.combineLatest)([(0, _rxjs.of)(header), api.queryAt(header.hash)])), (0, _rxjs.switchMap)(_ref => {
    let [header, queryAt] = _ref;
    return (0, _util2.getAuthorDetails)(header, queryAt);
  }), (0, _rxjs.map)(_ref2 => {
    let [header, validators, author] = _ref2;
    header.createdAtHash = header.hash;
    return (0, _type.createHeaderExtended)(header.registry, header, validators, author);
  })));
}
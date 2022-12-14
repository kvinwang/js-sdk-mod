"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ownContributions = ownContributions;
var _rxjs = require("rxjs");
var _util = require("@polkadot/util");
var _util2 = require("../util");
var _util3 = require("./util");
// Copyright 2017-2022 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

function _getValues(api, childKey, keys) {
  // We actually would love to use multi-keys https://github.com/paritytech/substrate/issues/9203
  return (0, _rxjs.combineLatest)(keys.map(k => api.rpc.childstate.getStorage(childKey, k))).pipe((0, _rxjs.map)(values => values.map(v => api.registry.createType('Option<StorageData>', v)).map(o => o.isSome ? api.registry.createType('Balance', o.unwrap()) : api.registry.createType('Balance')).reduce((all, b, index) => (0, _util.objectSpread)(all, {
    [keys[index]]: b
  }), {})));
}
function _watchOwnChanges(api, paraId, childkey, keys) {
  return api.query.system.events().pipe((0, _rxjs.switchMap)(events => {
    const changes = (0, _util3.extractContributed)(paraId, events);
    const filtered = keys.filter(k => changes.added.includes(k) || changes.removed.includes(k));
    return filtered.length ? _getValues(api, childkey, filtered) : _rxjs.EMPTY;
  }), (0, _rxjs.startWith)({}));
}
function _contributions(api, paraId, childKey, keys) {
  return (0, _rxjs.combineLatest)([_getValues(api, childKey, keys), _watchOwnChanges(api, paraId, childKey, keys)]).pipe((0, _rxjs.map)(_ref => {
    let [all, latest] = _ref;
    return (0, _util.objectSpread)({}, all, latest);
  }));
}
function ownContributions(instanceId, api) {
  return (0, _util2.memo)(instanceId, (paraId, keys) => api.derive.crowdloan.childKey(paraId).pipe((0, _rxjs.switchMap)(childKey => childKey && keys.length ? _contributions(api, paraId, childKey, keys) : (0, _rxjs.of)({}))));
}
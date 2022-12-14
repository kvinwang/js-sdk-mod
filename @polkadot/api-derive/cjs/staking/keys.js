"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.keys = void 0;
exports.keysMulti = keysMulti;
var _rxjs = require("rxjs");
var _util = require("../util");
// Copyright 2017-2022 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

function extractsIds(stashId, queuedKeys, nextKeys) {
  const sessionIds = (queuedKeys.find(_ref => {
    let [currentId] = _ref;
    return currentId.eq(stashId);
  }) || [undefined, []])[1];
  const nextSessionIds = nextKeys.unwrapOr([]);
  return {
    nextSessionIds: Array.isArray(nextSessionIds) ? nextSessionIds : [...nextSessionIds.values()],
    sessionIds: Array.isArray(sessionIds) ? sessionIds : [...sessionIds.values()]
  };
}
const keys = (0, _util.firstMemo)((api, stashId) => api.derive.staking.keysMulti([stashId]));
exports.keys = keys;
function keysMulti(instanceId, api) {
  return (0, _util.memo)(instanceId, stashIds => stashIds.length ? api.query.session.queuedKeys().pipe((0, _rxjs.switchMap)(queuedKeys => {
    var _api$consts$session;
    return (0, _rxjs.combineLatest)([(0, _rxjs.of)(queuedKeys), (_api$consts$session = api.consts.session) != null && _api$consts$session.dedupKeyPrefix ? api.query.session.nextKeys.multi(stashIds.map(s => [api.consts.session.dedupKeyPrefix, s])) : (0, _rxjs.combineLatest)(stashIds.map(s => api.query.session.nextKeys(s)))]);
  }), (0, _rxjs.map)(_ref2 => {
    let [queuedKeys, nextKeys] = _ref2;
    return stashIds.map((stashId, index) => extractsIds(stashId, queuedKeys, nextKeys[index]));
  })) : (0, _rxjs.of)([]));
}
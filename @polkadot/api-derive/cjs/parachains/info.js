"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.info = info;
var _rxjs = require("rxjs");
var _util = require("@polkadot/util");
var _util2 = require("../util");
var _util3 = require("./util");
// Copyright 2017-2022 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

function parseActive(id, active) {
  const found = active.find(_ref => {
    let [paraId] = _ref;
    return paraId === id;
  });
  if (found && found[1].isSome) {
    const [collatorId, retriable] = found[1].unwrap();
    return (0, _util.objectSpread)({
      collatorId
    }, retriable.isWithRetries ? {
      isRetriable: true,
      retries: retriable.asWithRetries.toNumber()
    } : {
      isRetriable: false,
      retries: 0
    });
  }
  return null;
}
function parseCollators(id, collatorQueue) {
  return collatorQueue.map(queue => {
    const found = queue.find(_ref2 => {
      let [paraId] = _ref2;
      return paraId === id;
    });
    return found ? found[1] : null;
  });
}
function parse(id, _ref3) {
  let [active, retryQueue, selectedThreads, didUpdate, info, pendingSwap, heads, relayDispatchQueue] = _ref3;
  if (info.isNone) {
    return null;
  }
  return {
    active: parseActive(id, active),
    didUpdate: (0, _util3.didUpdateToBool)(didUpdate, id),
    heads,
    id,
    info: (0, _util.objectSpread)({
      id
    }, info.unwrap()),
    pendingSwapId: pendingSwap.unwrapOr(null),
    relayDispatchQueue,
    retryCollators: parseCollators(id, retryQueue),
    selectedCollators: parseCollators(id, selectedThreads)
  };
}
function info(instanceId, api) {
  return (0, _util2.memo)(instanceId, id => api.query.registrar && api.query.parachains ? api.queryMulti([api.query.registrar.active, api.query.registrar.retryQueue, api.query.registrar.selectedThreads, api.query.parachains.didUpdate, [api.query.registrar.paras, id], [api.query.registrar.pendingSwap, id], [api.query.parachains.heads, id], [api.query.parachains.relayDispatchQueue, id]]).pipe((0, _rxjs.map)(result => parse(api.registry.createType('ParaId', id), result))) : (0, _rxjs.of)(null));
}
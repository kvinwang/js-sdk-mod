"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.overview = overview;
var _rxjs = require("rxjs");
var _util = require("@polkadot/util");
var _util2 = require("../util");
var _util3 = require("./util");
// Copyright 2017-2022 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

function parse(_ref) {
  let [ids, didUpdate, infos, pendingSwaps, relayDispatchQueueSizes] = _ref;
  return ids.map((id, index) => ({
    didUpdate: (0, _util3.didUpdateToBool)(didUpdate, id),
    id,
    info: (0, _util.objectSpread)({
      id
    }, infos[index].unwrapOr(null)),
    pendingSwapId: pendingSwaps[index].unwrapOr(null),
    relayDispatchQueueSize: relayDispatchQueueSizes[index][0].toNumber()
  }));
}
function overview(instanceId, api) {
  return (0, _util2.memo)(instanceId, () => {
    var _api$query$registrar;
    return (_api$query$registrar = api.query.registrar) != null && _api$query$registrar.parachains && api.query.parachains ? api.query.registrar.parachains().pipe((0, _rxjs.switchMap)(paraIds => (0, _rxjs.combineLatest)([(0, _rxjs.of)(paraIds), api.query.parachains.didUpdate(), api.query.registrar.paras.multi(paraIds), api.query.registrar.pendingSwap.multi(paraIds), api.query.parachains.relayDispatchQueueSize.multi(paraIds)])), (0, _rxjs.map)(parse)) : (0, _rxjs.of)([]);
  });
}
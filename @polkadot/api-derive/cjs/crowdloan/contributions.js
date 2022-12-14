"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.contributions = contributions;
var _rxjs = require("rxjs");
var _util = require("@polkadot/util");
var _util2 = require("../util");
var _util3 = require("./util");
// Copyright 2017-2022 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

const PAGE_SIZE_K = 1000; // limit aligned with the 1k on the node (trie lookups are heavy)

function _getUpdates(api, paraId) {
  let added = [];
  let removed = [];
  return api.query.system.events().pipe((0, _rxjs.switchMap)(events => {
    const changes = (0, _util3.extractContributed)(paraId, events);
    if (changes.added.length || changes.removed.length) {
      var _events$createdAtHash;
      added = added.concat(...changes.added);
      removed = removed.concat(...changes.removed);
      return (0, _rxjs.of)({
        added,
        addedDelta: changes.added,
        blockHash: ((_events$createdAtHash = events.createdAtHash) == null ? void 0 : _events$createdAtHash.toHex()) || '-',
        removed,
        removedDelta: changes.removed
      });
    }
    return _rxjs.EMPTY;
  }), (0, _rxjs.startWith)({
    added,
    addedDelta: [],
    blockHash: '-',
    removed,
    removedDelta: []
  }));
}
function _eventTriggerAll(api, paraId) {
  return api.query.system.events().pipe((0, _rxjs.switchMap)(events => {
    var _events$createdAtHash2;
    const items = events.filter(_ref => {
      let {
        event: {
          data: [eventParaId],
          method,
          section
        }
      } = _ref;
      return section === 'crowdloan' && ['AllRefunded', 'Dissolved', 'PartiallyRefunded'].includes(method) && eventParaId.eq(paraId);
    });
    return items.length ? (0, _rxjs.of)(((_events$createdAtHash2 = events.createdAtHash) == null ? void 0 : _events$createdAtHash2.toHex()) || '-') : _rxjs.EMPTY;
  }), (0, _rxjs.startWith)('-'));
}
function _getKeysPaged(api, childKey) {
  const subject = new _rxjs.BehaviorSubject(undefined);
  return subject.pipe((0, _rxjs.switchMap)(startKey => api.rpc.childstate.getKeysPaged(childKey, '0x', PAGE_SIZE_K, startKey)), (0, _rxjs.tap)(keys => {
    (0, _util.nextTick)(() => {
      keys.length === PAGE_SIZE_K ? subject.next(keys[PAGE_SIZE_K - 1].toHex()) : subject.complete();
    });
  }), (0, _rxjs.toArray)(),
  // toArray since we want to startSubject to be completed
  (0, _rxjs.map)(keyArr => (0, _util.arrayFlatten)(keyArr)));
}
function _getAll(api, paraId, childKey) {
  return _eventTriggerAll(api, paraId).pipe((0, _rxjs.switchMap)(() => (0, _util.isFunction)(api.rpc.childstate.getKeysPaged) ? _getKeysPaged(api, childKey) : api.rpc.childstate.getKeys(childKey, '0x')), (0, _rxjs.map)(keys => keys.map(k => k.toHex())));
}
function _contributions(api, paraId, childKey) {
  return (0, _rxjs.combineLatest)([_getAll(api, paraId, childKey), _getUpdates(api, paraId)]).pipe((0, _rxjs.map)(_ref2 => {
    let [keys, {
      added,
      blockHash,
      removed
    }] = _ref2;
    const contributorsMap = {};
    keys.forEach(k => {
      contributorsMap[k] = true;
    });
    added.forEach(k => {
      contributorsMap[k] = true;
    });
    removed.forEach(k => {
      delete contributorsMap[k];
    });
    return {
      blockHash,
      contributorsHex: Object.keys(contributorsMap)
    };
  }));
}
function contributions(instanceId, api) {
  return (0, _util2.memo)(instanceId, paraId => api.derive.crowdloan.childKey(paraId).pipe((0, _rxjs.switchMap)(childKey => childKey ? _contributions(api, paraId, childKey) : (0, _rxjs.of)({
    blockHash: '-',
    contributorsHex: []
  }))));
}
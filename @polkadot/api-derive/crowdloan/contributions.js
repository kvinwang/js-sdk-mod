// Copyright 2017-2022 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { BehaviorSubject, combineLatest, EMPTY, map, of, startWith, switchMap, tap, toArray } from 'rxjs';
import { arrayFlatten, isFunction, nextTick } from '@polkadot/util';
import { memo } from "../util/index.js";
import { extractContributed } from "./util.js";
const PAGE_SIZE_K = 1000; // limit aligned with the 1k on the node (trie lookups are heavy)

function _getUpdates(api, paraId) {
  let added = [];
  let removed = [];
  return api.query.system.events().pipe(switchMap(events => {
    const changes = extractContributed(paraId, events);
    if (changes.added.length || changes.removed.length) {
      var _events$createdAtHash;
      added = added.concat(...changes.added);
      removed = removed.concat(...changes.removed);
      return of({
        added,
        addedDelta: changes.added,
        blockHash: ((_events$createdAtHash = events.createdAtHash) == null ? void 0 : _events$createdAtHash.toHex()) || '-',
        removed,
        removedDelta: changes.removed
      });
    }
    return EMPTY;
  }), startWith({
    added,
    addedDelta: [],
    blockHash: '-',
    removed,
    removedDelta: []
  }));
}
function _eventTriggerAll(api, paraId) {
  return api.query.system.events().pipe(switchMap(events => {
    var _events$createdAtHash2;
    const items = events.filter(({
      event: {
        data: [eventParaId],
        method,
        section
      }
    }) => section === 'crowdloan' && ['AllRefunded', 'Dissolved', 'PartiallyRefunded'].includes(method) && eventParaId.eq(paraId));
    return items.length ? of(((_events$createdAtHash2 = events.createdAtHash) == null ? void 0 : _events$createdAtHash2.toHex()) || '-') : EMPTY;
  }), startWith('-'));
}
function _getKeysPaged(api, childKey) {
  const subject = new BehaviorSubject(undefined);
  return subject.pipe(switchMap(startKey => api.rpc.childstate.getKeysPaged(childKey, '0x', PAGE_SIZE_K, startKey)), tap(keys => {
    nextTick(() => {
      keys.length === PAGE_SIZE_K ? subject.next(keys[PAGE_SIZE_K - 1].toHex()) : subject.complete();
    });
  }), toArray(),
  // toArray since we want to startSubject to be completed
  map(keyArr => arrayFlatten(keyArr)));
}
function _getAll(api, paraId, childKey) {
  return _eventTriggerAll(api, paraId).pipe(switchMap(() => isFunction(api.rpc.childstate.getKeysPaged) ? _getKeysPaged(api, childKey) : api.rpc.childstate.getKeys(childKey, '0x')), map(keys => keys.map(k => k.toHex())));
}
function _contributions(api, paraId, childKey) {
  return combineLatest([_getAll(api, paraId, childKey), _getUpdates(api, paraId)]).pipe(map(([keys, {
    added,
    blockHash,
    removed
  }]) => {
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
export function contributions(instanceId, api) {
  return memo(instanceId, paraId => api.derive.crowdloan.childKey(paraId).pipe(switchMap(childKey => childKey ? _contributions(api, paraId, childKey) : of({
    blockHash: '-',
    contributorsHex: []
  }))));
}
// Copyright 2017-2022 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { combineLatest, EMPTY, map, of, startWith, switchMap } from 'rxjs';
import { objectSpread } from '@polkadot/util';
import { memo } from "../util/index.js";
import { extractContributed } from "./util.js";
function _getValues(api, childKey, keys) {
  // We actually would love to use multi-keys https://github.com/paritytech/substrate/issues/9203
  return combineLatest(keys.map(k => api.rpc.childstate.getStorage(childKey, k))).pipe(map(values => values.map(v => api.registry.createType('Option<StorageData>', v)).map(o => o.isSome ? api.registry.createType('Balance', o.unwrap()) : api.registry.createType('Balance')).reduce((all, b, index) => objectSpread(all, {
    [keys[index]]: b
  }), {})));
}
function _watchOwnChanges(api, paraId, childkey, keys) {
  return api.query.system.events().pipe(switchMap(events => {
    const changes = extractContributed(paraId, events);
    const filtered = keys.filter(k => changes.added.includes(k) || changes.removed.includes(k));
    return filtered.length ? _getValues(api, childkey, filtered) : EMPTY;
  }), startWith({}));
}
function _contributions(api, paraId, childKey, keys) {
  return combineLatest([_getValues(api, childKey, keys), _watchOwnChanges(api, paraId, childKey, keys)]).pipe(map(([all, latest]) => objectSpread({}, all, latest)));
}
export function ownContributions(instanceId, api) {
  return memo(instanceId, (paraId, keys) => api.derive.crowdloan.childKey(paraId).pipe(switchMap(childKey => childKey && keys.length ? _contributions(api, paraId, childKey, keys) : of({}))));
}
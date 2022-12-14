// Copyright 2017-2022 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { combineLatest, map, of, switchMap } from 'rxjs';
import { firstMemo, memo } from "../util/index.js";
function extractsIds(stashId, queuedKeys, nextKeys) {
  const sessionIds = (queuedKeys.find(([currentId]) => currentId.eq(stashId)) || [undefined, []])[1];
  const nextSessionIds = nextKeys.unwrapOr([]);
  return {
    nextSessionIds: Array.isArray(nextSessionIds) ? nextSessionIds : [...nextSessionIds.values()],
    sessionIds: Array.isArray(sessionIds) ? sessionIds : [...sessionIds.values()]
  };
}
export const keys = firstMemo((api, stashId) => api.derive.staking.keysMulti([stashId]));
export function keysMulti(instanceId, api) {
  return memo(instanceId, stashIds => stashIds.length ? api.query.session.queuedKeys().pipe(switchMap(queuedKeys => {
    var _api$consts$session;
    return combineLatest([of(queuedKeys), (_api$consts$session = api.consts.session) != null && _api$consts$session.dedupKeyPrefix ? api.query.session.nextKeys.multi(stashIds.map(s => [api.consts.session.dedupKeyPrefix, s])) : combineLatest(stashIds.map(s => api.query.session.nextKeys(s)))]);
  }), map(([queuedKeys, nextKeys]) => stashIds.map((stashId, index) => extractsIds(stashId, queuedKeys, nextKeys[index])))) : of([]));
}
// Copyright 2017-2022 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { map, of } from 'rxjs';
import { objectSpread } from '@polkadot/util';
import { memo } from "../util/index.js";
import { didUpdateToBool } from "./util.js";
function parseActive(id, active) {
  const found = active.find(([paraId]) => paraId === id);
  if (found && found[1].isSome) {
    const [collatorId, retriable] = found[1].unwrap();
    return objectSpread({
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
    const found = queue.find(([paraId]) => paraId === id);
    return found ? found[1] : null;
  });
}
function parse(id, [active, retryQueue, selectedThreads, didUpdate, info, pendingSwap, heads, relayDispatchQueue]) {
  if (info.isNone) {
    return null;
  }
  return {
    active: parseActive(id, active),
    didUpdate: didUpdateToBool(didUpdate, id),
    heads,
    id,
    info: objectSpread({
      id
    }, info.unwrap()),
    pendingSwapId: pendingSwap.unwrapOr(null),
    relayDispatchQueue,
    retryCollators: parseCollators(id, retryQueue),
    selectedCollators: parseCollators(id, selectedThreads)
  };
}
export function info(instanceId, api) {
  return memo(instanceId, id => api.query.registrar && api.query.parachains ? api.queryMulti([api.query.registrar.active, api.query.registrar.retryQueue, api.query.registrar.selectedThreads, api.query.parachains.didUpdate, [api.query.registrar.paras, id], [api.query.registrar.pendingSwap, id], [api.query.parachains.heads, id], [api.query.parachains.relayDispatchQueue, id]]).pipe(map(result => parse(api.registry.createType('ParaId', id), result))) : of(null));
}
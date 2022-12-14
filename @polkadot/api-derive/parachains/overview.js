// Copyright 2017-2022 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { combineLatest, map, of, switchMap } from 'rxjs';
import { objectSpread } from '@polkadot/util';
import { memo } from "../util/index.js";
import { didUpdateToBool } from "./util.js";
function parse([ids, didUpdate, infos, pendingSwaps, relayDispatchQueueSizes]) {
  return ids.map((id, index) => ({
    didUpdate: didUpdateToBool(didUpdate, id),
    id,
    info: objectSpread({
      id
    }, infos[index].unwrapOr(null)),
    pendingSwapId: pendingSwaps[index].unwrapOr(null),
    relayDispatchQueueSize: relayDispatchQueueSizes[index][0].toNumber()
  }));
}
export function overview(instanceId, api) {
  return memo(instanceId, () => {
    var _api$query$registrar;
    return (_api$query$registrar = api.query.registrar) != null && _api$query$registrar.parachains && api.query.parachains ? api.query.registrar.parachains().pipe(switchMap(paraIds => combineLatest([of(paraIds), api.query.parachains.didUpdate(), api.query.registrar.paras.multi(paraIds), api.query.registrar.pendingSwap.multi(paraIds), api.query.parachains.relayDispatchQueueSize.multi(paraIds)])), map(parse)) : of([]);
  });
}
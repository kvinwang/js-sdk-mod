// Copyright 2017-2022 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { combineLatest, map, of, switchMap } from 'rxjs';
import { objectSpread } from '@polkadot/util';
import { memo } from "../util/index.js";
function withProgressField(field) {
  return (instanceId, api) => memo(instanceId, () => api.derive.session.progress().pipe(map(info => info[field])));
}
function createDerive(api, info, [currentSlot, epochIndex, epochOrGenesisStartSlot, activeEraStartSessionIndex]) {
  const epochStartSlot = epochIndex.mul(info.sessionLength).iadd(epochOrGenesisStartSlot);
  const sessionProgress = currentSlot.sub(epochStartSlot);
  const eraProgress = info.currentIndex.sub(activeEraStartSessionIndex).imul(info.sessionLength).iadd(sessionProgress);
  return objectSpread({
    eraProgress: api.registry.createType('BlockNumber', eraProgress),
    sessionProgress: api.registry.createType('BlockNumber', sessionProgress)
  }, info);
}
function queryAura(api) {
  return api.derive.session.info().pipe(map(info => objectSpread({
    eraProgress: api.registry.createType('BlockNumber'),
    sessionProgress: api.registry.createType('BlockNumber')
  }, info)));
}
function queryBabe(api) {
  return api.derive.session.info().pipe(switchMap(info => {
    var _api$query$staking;
    return combineLatest([of(info),
    // we may have no staking, but have babe (permissioned)
    (_api$query$staking = api.query.staking) != null && _api$query$staking.erasStartSessionIndex ? api.queryMulti([api.query.babe.currentSlot, api.query.babe.epochIndex, api.query.babe.genesisSlot, [api.query.staking.erasStartSessionIndex, info.activeEra]]) : api.queryMulti([api.query.babe.currentSlot, api.query.babe.epochIndex, api.query.babe.genesisSlot])]);
  }), map(([info, [currentSlot, epochIndex, genesisSlot, optStartIndex]]) => [info, [currentSlot, epochIndex, genesisSlot, optStartIndex && optStartIndex.isSome ? optStartIndex.unwrap() : api.registry.createType('SessionIndex', 1)]]));
}

/**
 * @description Retrieves all the session and era query and calculates specific values on it as the length of the session and eras
 */
export function progress(instanceId, api) {
  return memo(instanceId, () => api.query.babe ? queryBabe(api).pipe(map(([info, slots]) => createDerive(api, info, slots))) : queryAura(api));
}
export const eraLength = withProgressField('eraLength');
export const eraProgress = withProgressField('eraProgress');
export const sessionProgress = withProgressField('sessionProgress');
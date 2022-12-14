// Copyright 2017-2022 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { combineLatest, map, switchMap } from 'rxjs';
import { BN, BN_ZERO, objectSpread } from '@polkadot/util';
import { firstMemo, memo } from "../util/index.js";
const QUERY_OPTS = {
  withDestination: true,
  withLedger: true,
  withNominations: true,
  withPrefs: true
};
function groupByEra(list) {
  return list.reduce((map, {
    era,
    value
  }) => {
    const key = era.toString();
    map[key] = (map[key] || BN_ZERO).add(value.unwrap());
    return map;
  }, {});
}
function calculateUnlocking(api, stakingLedger, sessionInfo) {
  const results = Object.entries(groupByEra(((stakingLedger == null ? void 0 : stakingLedger.unlocking) || []).filter(({
    era
  }) => era.unwrap().gt(sessionInfo.activeEra)))).map(([eraString, value]) => ({
    remainingEras: new BN(eraString).isub(sessionInfo.activeEra),
    value: api.registry.createType('Balance', value)
  }));
  return results.length ? results : undefined;
}
function redeemableSum(api, stakingLedger, sessionInfo) {
  return api.registry.createType('Balance', ((stakingLedger == null ? void 0 : stakingLedger.unlocking) || []).reduce((total, {
    era,
    value
  }) => {
    // aligns with https://github.com/paritytech/substrate/blob/fdfdc73f9e64dc47934b72eb9af3e1989e4ba699/frame/staking/src/pallet/mod.rs#L973-L975
    // (ensure currentEra >= era passed, as per https://github.com/paritytech/substrate/blob/fdfdc73f9e64dc47934b72eb9af3e1989e4ba699/frame/staking/src/lib.rs#L477-L494)
    // NOTE: Previously we used activeEra >= era, which is incorrect for the last session
    return era.unwrap().gt(sessionInfo.currentEra) ? total : total.iadd(value.unwrap());
  }, new BN(0)));
}
function parseResult(api, sessionInfo, keys, query) {
  return objectSpread({}, keys, query, {
    redeemable: redeemableSum(api, query.stakingLedger, sessionInfo),
    unlocking: calculateUnlocking(api, query.stakingLedger, sessionInfo)
  });
}

/**
 * @description From a list of stashes, fill in all the relevant staking details
 */
export function accounts(instanceId, api) {
  return memo(instanceId, (accountIds, opts = QUERY_OPTS) => api.derive.session.info().pipe(switchMap(sessionInfo => combineLatest([api.derive.staking.keysMulti(accountIds), api.derive.staking.queryMulti(accountIds, opts)]).pipe(map(([keys, queries]) => queries.map((q, index) => parseResult(api, sessionInfo, keys[index], q)))))));
}

/**
 * @description From a stash, retrieve the controllerId and fill in all the relevant staking details
 */
export const account = firstMemo((api, accountId, opts) => api.derive.staking.accounts([accountId], opts));
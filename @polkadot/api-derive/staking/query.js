// Copyright 2017-2022 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { combineLatest, map, of, switchMap } from 'rxjs';
import { firstMemo, memo } from "../util/index.js";
function parseDetails(stashId, controllerIdOpt, nominatorsOpt, rewardDestination, validatorPrefs, exposure, stakingLedgerOpt) {
  return {
    accountId: stashId,
    controllerId: controllerIdOpt && controllerIdOpt.unwrapOr(null),
    exposure,
    nominators: nominatorsOpt.isSome ? nominatorsOpt.unwrap().targets : [],
    rewardDestination,
    stakingLedger: stakingLedgerOpt.unwrapOrDefault(),
    stashId,
    validatorPrefs
  };
}
function getLedgers(api, optIds, {
  withLedger = false
}) {
  const ids = optIds.filter(o => withLedger && !!o && o.isSome).map(o => o.unwrap());
  const emptyLed = api.registry.createType('Option<StakingLedger>');
  return (ids.length ? combineLatest(ids.map(s => api.query.staking.ledger(s))) : of([])).pipe(map(optLedgers => {
    let offset = -1;
    return optIds.map(o => o && o.isSome ? optLedgers[++offset] || emptyLed : emptyLed);
  }));
}
function getStashInfo(api, stashIds, activeEra, {
  withController,
  withDestination,
  withExposure,
  withLedger,
  withNominations,
  withPrefs
}) {
  const emptyNoms = api.registry.createType('Option<Nominations>');
  const emptyRewa = api.registry.createType('RewardDestination');
  const emptyExpo = api.registry.createType('Exposure');
  const emptyPrefs = api.registry.createType('ValidatorPrefs');
  return combineLatest([withController || withLedger ? combineLatest(stashIds.map(s => api.query.staking.bonded(s))) : of(stashIds.map(() => null)), withNominations ? combineLatest(stashIds.map(s => api.query.staking.nominators(s))) : of(stashIds.map(() => emptyNoms)), withDestination ? combineLatest(stashIds.map(s => api.query.staking.payee(s))) : of(stashIds.map(() => emptyRewa)), withPrefs ? combineLatest(stashIds.map(s => api.query.staking.validators(s))) : of(stashIds.map(() => emptyPrefs)), withExposure ? combineLatest(stashIds.map(s => api.query.staking.erasStakers(activeEra, s))) : of(stashIds.map(() => emptyExpo))]);
}
function getBatch(api, activeEra, stashIds, flags) {
  return getStashInfo(api, stashIds, activeEra, flags).pipe(switchMap(([controllerIdOpt, nominatorsOpt, rewardDestination, validatorPrefs, exposure]) => getLedgers(api, controllerIdOpt, flags).pipe(map(stakingLedgerOpts => stashIds.map((stashId, index) => parseDetails(stashId, controllerIdOpt[index], nominatorsOpt[index], rewardDestination[index], validatorPrefs[index], exposure[index], stakingLedgerOpts[index]))))));
}

//
/**
 * @description From a stash, retrieve the controllerId and all relevant details
 */
export const query = firstMemo((api, accountId, flags) => api.derive.staking.queryMulti([accountId], flags));
export function queryMulti(instanceId, api) {
  return memo(instanceId, (accountIds, flags) => api.derive.session.indexes().pipe(switchMap(({
    activeEra
  }) => {
    const stashIds = accountIds.map(a => api.registry.createType('AccountId', a));
    return stashIds.length ? getBatch(api, activeEra, stashIds, flags) : of([]);
  })));
}
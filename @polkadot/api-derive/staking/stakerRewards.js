// Copyright 2017-2022 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { combineLatest, map, of, switchMap } from 'rxjs';
import { BN_BILLION, BN_ZERO, objectSpread } from '@polkadot/util';
import { firstMemo, memo } from "../util/index.js";
function parseRewards(api, stashId, [erasPoints, erasPrefs, erasRewards], exposures) {
  return exposures.map(({
    era,
    isEmpty,
    isValidator,
    nominating,
    validators: eraValidators
  }) => {
    const {
      eraPoints,
      validators: allValPoints
    } = erasPoints.find(p => p.era.eq(era)) || {
      eraPoints: BN_ZERO,
      validators: {}
    };
    const {
      eraReward
    } = erasRewards.find(r => r.era.eq(era)) || {
      eraReward: api.registry.createType('Balance')
    };
    const {
      validators: allValPrefs
    } = erasPrefs.find(p => p.era.eq(era)) || {
      validators: {}
    };
    const validators = {};
    const stakerId = stashId.toString();
    Object.entries(eraValidators).forEach(([validatorId, exposure]) => {
      var _allValPrefs$validato, _exposure$total;
      const valPoints = allValPoints[validatorId] || BN_ZERO;
      const valComm = ((_allValPrefs$validato = allValPrefs[validatorId]) == null ? void 0 : _allValPrefs$validato.commission.unwrap()) || BN_ZERO;
      const expTotal = ((_exposure$total = exposure.total) == null ? void 0 : _exposure$total.unwrap()) || BN_ZERO;
      let avail = BN_ZERO;
      let value;
      if (!(expTotal.isZero() || valPoints.isZero() || eraPoints.isZero())) {
        avail = eraReward.mul(valPoints).div(eraPoints);
        const valCut = valComm.mul(avail).div(BN_BILLION);
        let staked;
        if (validatorId === stakerId) {
          staked = exposure.own.unwrap();
        } else {
          const stakerExp = exposure.others.find(({
            who
          }) => who.eq(stakerId));
          staked = stakerExp ? stakerExp.value.unwrap() : BN_ZERO;
        }
        value = avail.sub(valCut).imul(staked).div(expTotal).iadd(validatorId === stakerId ? valCut : BN_ZERO);
      }
      validators[validatorId] = {
        total: api.registry.createType('Balance', avail),
        value: api.registry.createType('Balance', value)
      };
    });
    return {
      era,
      eraReward,
      isEmpty,
      isValidator,
      nominating,
      validators
    };
  });
}
function allUniqValidators(rewards) {
  return rewards.reduce(([all, perStash], rewards) => {
    const uniq = [];
    perStash.push(uniq);
    rewards.forEach(({
      validators
    }) => Object.keys(validators).forEach(validatorId => {
      if (!uniq.includes(validatorId)) {
        uniq.push(validatorId);
        if (!all.includes(validatorId)) {
          all.push(validatorId);
        }
      }
    }));
    return [all, perStash];
  }, [[], []]);
}
function removeClaimed(validators, queryValidators, reward) {
  const rm = [];
  Object.keys(reward.validators).forEach(validatorId => {
    const index = validators.indexOf(validatorId);
    if (index !== -1) {
      const valLedger = queryValidators[index].stakingLedger;
      if (valLedger != null && valLedger.claimedRewards.some(e => reward.era.eq(e))) {
        rm.push(validatorId);
      }
    }
  });
  rm.forEach(validatorId => {
    delete reward.validators[validatorId];
  });
}
function filterRewards(eras, valInfo, {
  rewards,
  stakingLedger
}) {
  const filter = eras.filter(e => !stakingLedger.claimedRewards.some(s => s.eq(e)));
  const validators = valInfo.map(([v]) => v);
  const queryValidators = valInfo.map(([, q]) => q);
  return rewards.filter(({
    isEmpty
  }) => !isEmpty).filter(reward => {
    if (!filter.some(e => reward.era.eq(e))) {
      return false;
    }
    removeClaimed(validators, queryValidators, reward);
    return true;
  }).filter(({
    validators
  }) => Object.keys(validators).length !== 0).map(reward => objectSpread({}, reward, {
    nominators: reward.nominating.filter(n => reward.validators[n.validatorId])
  }));
}
export function _stakerRewardsEras(instanceId, api) {
  return memo(instanceId, (eras, withActive = false) => combineLatest([api.derive.staking._erasPoints(eras, withActive), api.derive.staking._erasPrefs(eras, withActive), api.derive.staking._erasRewards(eras, withActive)]));
}
export function _stakerRewards(instanceId, api) {
  return memo(instanceId, (accountIds, eras, withActive = false) => combineLatest([api.derive.staking.queryMulti(accountIds, {
    withLedger: true
  }), api.derive.staking._stakerExposures(accountIds, eras, withActive), api.derive.staking._stakerRewardsEras(eras, withActive)]).pipe(switchMap(([queries, exposures, erasResult]) => {
    const allRewards = queries.map(({
      stakingLedger,
      stashId
    }, index) => !stashId || !stakingLedger ? [] : parseRewards(api, stashId, erasResult, exposures[index]));
    if (withActive) {
      return of(allRewards);
    }
    const [allValidators, stashValidators] = allUniqValidators(allRewards);
    return api.derive.staking.queryMulti(allValidators, {
      withLedger: true
    }).pipe(map(queriedVals => queries.map(({
      stakingLedger
    }, index) => filterRewards(eras, stashValidators[index].map(validatorId => [validatorId, queriedVals.find(q => q.accountId.eq(validatorId))]), {
      rewards: allRewards[index],
      stakingLedger
    }))));
  })));
}
export const stakerRewards = firstMemo((api, accountId, withActive) => api.derive.staking.erasHistoric(withActive).pipe(switchMap(eras => api.derive.staking._stakerRewards([accountId], eras, withActive))));
export function stakerRewardsMultiEras(instanceId, api) {
  return memo(instanceId, (accountIds, eras) => accountIds.length && eras.length ? api.derive.staking._stakerRewards(accountIds, eras, false) : of([]));
}
export function stakerRewardsMulti(instanceId, api) {
  return memo(instanceId, (accountIds, withActive = false) => api.derive.staking.erasHistoric(withActive).pipe(switchMap(eras => api.derive.staking.stakerRewardsMultiEras(accountIds, eras))));
}
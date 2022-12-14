"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._stakerRewards = _stakerRewards;
exports._stakerRewardsEras = _stakerRewardsEras;
exports.stakerRewards = void 0;
exports.stakerRewardsMulti = stakerRewardsMulti;
exports.stakerRewardsMultiEras = stakerRewardsMultiEras;
var _rxjs = require("rxjs");
var _util = require("@polkadot/util");
var _util2 = require("../util");
// Copyright 2017-2022 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

function parseRewards(api, stashId, _ref, exposures) {
  let [erasPoints, erasPrefs, erasRewards] = _ref;
  return exposures.map(_ref2 => {
    let {
      era,
      isEmpty,
      isValidator,
      nominating,
      validators: eraValidators
    } = _ref2;
    const {
      eraPoints,
      validators: allValPoints
    } = erasPoints.find(p => p.era.eq(era)) || {
      eraPoints: _util.BN_ZERO,
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
    Object.entries(eraValidators).forEach(_ref3 => {
      var _allValPrefs$validato, _exposure$total;
      let [validatorId, exposure] = _ref3;
      const valPoints = allValPoints[validatorId] || _util.BN_ZERO;
      const valComm = ((_allValPrefs$validato = allValPrefs[validatorId]) == null ? void 0 : _allValPrefs$validato.commission.unwrap()) || _util.BN_ZERO;
      const expTotal = ((_exposure$total = exposure.total) == null ? void 0 : _exposure$total.unwrap()) || _util.BN_ZERO;
      let avail = _util.BN_ZERO;
      let value;
      if (!(expTotal.isZero() || valPoints.isZero() || eraPoints.isZero())) {
        avail = eraReward.mul(valPoints).div(eraPoints);
        const valCut = valComm.mul(avail).div(_util.BN_BILLION);
        let staked;
        if (validatorId === stakerId) {
          staked = exposure.own.unwrap();
        } else {
          const stakerExp = exposure.others.find(_ref4 => {
            let {
              who
            } = _ref4;
            return who.eq(stakerId);
          });
          staked = stakerExp ? stakerExp.value.unwrap() : _util.BN_ZERO;
        }
        value = avail.sub(valCut).imul(staked).div(expTotal).iadd(validatorId === stakerId ? valCut : _util.BN_ZERO);
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
  return rewards.reduce((_ref5, rewards) => {
    let [all, perStash] = _ref5;
    const uniq = [];
    perStash.push(uniq);
    rewards.forEach(_ref6 => {
      let {
        validators
      } = _ref6;
      return Object.keys(validators).forEach(validatorId => {
        if (!uniq.includes(validatorId)) {
          uniq.push(validatorId);
          if (!all.includes(validatorId)) {
            all.push(validatorId);
          }
        }
      });
    });
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
function filterRewards(eras, valInfo, _ref7) {
  let {
    rewards,
    stakingLedger
  } = _ref7;
  const filter = eras.filter(e => !stakingLedger.claimedRewards.some(s => s.eq(e)));
  const validators = valInfo.map(_ref8 => {
    let [v] = _ref8;
    return v;
  });
  const queryValidators = valInfo.map(_ref9 => {
    let [, q] = _ref9;
    return q;
  });
  return rewards.filter(_ref10 => {
    let {
      isEmpty
    } = _ref10;
    return !isEmpty;
  }).filter(reward => {
    if (!filter.some(e => reward.era.eq(e))) {
      return false;
    }
    removeClaimed(validators, queryValidators, reward);
    return true;
  }).filter(_ref11 => {
    let {
      validators
    } = _ref11;
    return Object.keys(validators).length !== 0;
  }).map(reward => (0, _util.objectSpread)({}, reward, {
    nominators: reward.nominating.filter(n => reward.validators[n.validatorId])
  }));
}
function _stakerRewardsEras(instanceId, api) {
  return (0, _util2.memo)(instanceId, function (eras) {
    let withActive = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    return (0, _rxjs.combineLatest)([api.derive.staking._erasPoints(eras, withActive), api.derive.staking._erasPrefs(eras, withActive), api.derive.staking._erasRewards(eras, withActive)]);
  });
}
function _stakerRewards(instanceId, api) {
  return (0, _util2.memo)(instanceId, function (accountIds, eras) {
    let withActive = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    return (0, _rxjs.combineLatest)([api.derive.staking.queryMulti(accountIds, {
      withLedger: true
    }), api.derive.staking._stakerExposures(accountIds, eras, withActive), api.derive.staking._stakerRewardsEras(eras, withActive)]).pipe((0, _rxjs.switchMap)(_ref12 => {
      let [queries, exposures, erasResult] = _ref12;
      const allRewards = queries.map((_ref13, index) => {
        let {
          stakingLedger,
          stashId
        } = _ref13;
        return !stashId || !stakingLedger ? [] : parseRewards(api, stashId, erasResult, exposures[index]);
      });
      if (withActive) {
        return (0, _rxjs.of)(allRewards);
      }
      const [allValidators, stashValidators] = allUniqValidators(allRewards);
      return api.derive.staking.queryMulti(allValidators, {
        withLedger: true
      }).pipe((0, _rxjs.map)(queriedVals => queries.map((_ref14, index) => {
        let {
          stakingLedger
        } = _ref14;
        return filterRewards(eras, stashValidators[index].map(validatorId => [validatorId, queriedVals.find(q => q.accountId.eq(validatorId))]), {
          rewards: allRewards[index],
          stakingLedger
        });
      })));
    }));
  });
}
const stakerRewards = (0, _util2.firstMemo)((api, accountId, withActive) => api.derive.staking.erasHistoric(withActive).pipe((0, _rxjs.switchMap)(eras => api.derive.staking._stakerRewards([accountId], eras, withActive))));
exports.stakerRewards = stakerRewards;
function stakerRewardsMultiEras(instanceId, api) {
  return (0, _util2.memo)(instanceId, (accountIds, eras) => accountIds.length && eras.length ? api.derive.staking._stakerRewards(accountIds, eras, false) : (0, _rxjs.of)([]));
}
function stakerRewardsMulti(instanceId, api) {
  return (0, _util2.memo)(instanceId, function (accountIds) {
    let withActive = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    return api.derive.staking.erasHistoric(withActive).pipe((0, _rxjs.switchMap)(eras => api.derive.staking.stakerRewardsMultiEras(accountIds, eras)));
  });
}
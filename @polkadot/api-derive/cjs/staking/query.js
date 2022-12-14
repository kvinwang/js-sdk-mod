"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.query = void 0;
exports.queryMulti = queryMulti;
var _rxjs = require("rxjs");
var _util = require("../util");
// Copyright 2017-2022 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

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
function getLedgers(api, optIds, _ref) {
  let {
    withLedger = false
  } = _ref;
  const ids = optIds.filter(o => withLedger && !!o && o.isSome).map(o => o.unwrap());
  const emptyLed = api.registry.createType('Option<StakingLedger>');
  return (ids.length ? (0, _rxjs.combineLatest)(ids.map(s => api.query.staking.ledger(s))) : (0, _rxjs.of)([])).pipe((0, _rxjs.map)(optLedgers => {
    let offset = -1;
    return optIds.map(o => o && o.isSome ? optLedgers[++offset] || emptyLed : emptyLed);
  }));
}
function getStashInfo(api, stashIds, activeEra, _ref2) {
  let {
    withController,
    withDestination,
    withExposure,
    withLedger,
    withNominations,
    withPrefs
  } = _ref2;
  const emptyNoms = api.registry.createType('Option<Nominations>');
  const emptyRewa = api.registry.createType('RewardDestination');
  const emptyExpo = api.registry.createType('Exposure');
  const emptyPrefs = api.registry.createType('ValidatorPrefs');
  return (0, _rxjs.combineLatest)([withController || withLedger ? (0, _rxjs.combineLatest)(stashIds.map(s => api.query.staking.bonded(s))) : (0, _rxjs.of)(stashIds.map(() => null)), withNominations ? (0, _rxjs.combineLatest)(stashIds.map(s => api.query.staking.nominators(s))) : (0, _rxjs.of)(stashIds.map(() => emptyNoms)), withDestination ? (0, _rxjs.combineLatest)(stashIds.map(s => api.query.staking.payee(s))) : (0, _rxjs.of)(stashIds.map(() => emptyRewa)), withPrefs ? (0, _rxjs.combineLatest)(stashIds.map(s => api.query.staking.validators(s))) : (0, _rxjs.of)(stashIds.map(() => emptyPrefs)), withExposure ? (0, _rxjs.combineLatest)(stashIds.map(s => api.query.staking.erasStakers(activeEra, s))) : (0, _rxjs.of)(stashIds.map(() => emptyExpo))]);
}
function getBatch(api, activeEra, stashIds, flags) {
  return getStashInfo(api, stashIds, activeEra, flags).pipe((0, _rxjs.switchMap)(_ref3 => {
    let [controllerIdOpt, nominatorsOpt, rewardDestination, validatorPrefs, exposure] = _ref3;
    return getLedgers(api, controllerIdOpt, flags).pipe((0, _rxjs.map)(stakingLedgerOpts => stashIds.map((stashId, index) => parseDetails(stashId, controllerIdOpt[index], nominatorsOpt[index], rewardDestination[index], validatorPrefs[index], exposure[index], stakingLedgerOpts[index]))));
  }));
}

//
/**
 * @description From a stash, retrieve the controllerId and all relevant details
 */
const query = (0, _util.firstMemo)((api, accountId, flags) => api.derive.staking.queryMulti([accountId], flags));
exports.query = query;
function queryMulti(instanceId, api) {
  return (0, _util.memo)(instanceId, (accountIds, flags) => api.derive.session.indexes().pipe((0, _rxjs.switchMap)(_ref4 => {
    let {
      activeEra
    } = _ref4;
    const stashIds = accountIds.map(a => api.registry.createType('AccountId', a));
    return stashIds.length ? getBatch(api, activeEra, stashIds, flags) : (0, _rxjs.of)([]);
  })));
}
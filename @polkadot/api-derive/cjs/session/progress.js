"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.eraProgress = exports.eraLength = void 0;
exports.progress = progress;
exports.sessionProgress = void 0;
var _rxjs = require("rxjs");
var _util = require("@polkadot/util");
var _util2 = require("../util");
// Copyright 2017-2022 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

function withProgressField(field) {
  return (instanceId, api) => (0, _util2.memo)(instanceId, () => api.derive.session.progress().pipe((0, _rxjs.map)(info => info[field])));
}
function createDerive(api, info, _ref) {
  let [currentSlot, epochIndex, epochOrGenesisStartSlot, activeEraStartSessionIndex] = _ref;
  const epochStartSlot = epochIndex.mul(info.sessionLength).iadd(epochOrGenesisStartSlot);
  const sessionProgress = currentSlot.sub(epochStartSlot);
  const eraProgress = info.currentIndex.sub(activeEraStartSessionIndex).imul(info.sessionLength).iadd(sessionProgress);
  return (0, _util.objectSpread)({
    eraProgress: api.registry.createType('BlockNumber', eraProgress),
    sessionProgress: api.registry.createType('BlockNumber', sessionProgress)
  }, info);
}
function queryAura(api) {
  return api.derive.session.info().pipe((0, _rxjs.map)(info => (0, _util.objectSpread)({
    eraProgress: api.registry.createType('BlockNumber'),
    sessionProgress: api.registry.createType('BlockNumber')
  }, info)));
}
function queryBabe(api) {
  return api.derive.session.info().pipe((0, _rxjs.switchMap)(info => {
    var _api$query$staking;
    return (0, _rxjs.combineLatest)([(0, _rxjs.of)(info),
    // we may have no staking, but have babe (permissioned)
    (_api$query$staking = api.query.staking) != null && _api$query$staking.erasStartSessionIndex ? api.queryMulti([api.query.babe.currentSlot, api.query.babe.epochIndex, api.query.babe.genesisSlot, [api.query.staking.erasStartSessionIndex, info.activeEra]]) : api.queryMulti([api.query.babe.currentSlot, api.query.babe.epochIndex, api.query.babe.genesisSlot])]);
  }), (0, _rxjs.map)(_ref2 => {
    let [info, [currentSlot, epochIndex, genesisSlot, optStartIndex]] = _ref2;
    return [info, [currentSlot, epochIndex, genesisSlot, optStartIndex && optStartIndex.isSome ? optStartIndex.unwrap() : api.registry.createType('SessionIndex', 1)]];
  }));
}

/**
 * @description Retrieves all the session and era query and calculates specific values on it as the length of the session and eras
 */
function progress(instanceId, api) {
  return (0, _util2.memo)(instanceId, () => api.query.babe ? queryBabe(api).pipe((0, _rxjs.map)(_ref3 => {
    let [info, slots] = _ref3;
    return createDerive(api, info, slots);
  })) : queryAura(api));
}
const eraLength = withProgressField('eraLength');
exports.eraLength = eraLength;
const eraProgress = withProgressField('eraProgress');
exports.eraProgress = eraProgress;
const sessionProgress = withProgressField('sessionProgress');
exports.sessionProgress = sessionProgress;
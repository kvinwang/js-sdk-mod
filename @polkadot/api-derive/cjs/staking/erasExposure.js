"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._eraExposure = _eraExposure;
exports.erasExposure = exports.eraExposure = exports._erasExposure = void 0;
var _rxjs = require("rxjs");
var _util = require("../util");
var _cache = require("./cache");
var _util2 = require("./util");
// Copyright 2017-2022 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

const CACHE_KEY = 'eraExposure';
function mapStakers(era, stakers) {
  const nominators = {};
  const validators = {};
  stakers.forEach(_ref => {
    let [key, exposure] = _ref;
    const validatorId = key.args[1].toString();
    validators[validatorId] = exposure;
    exposure.others.forEach((_ref2, validatorIndex) => {
      let {
        who
      } = _ref2;
      const nominatorId = who.toString();
      nominators[nominatorId] = nominators[nominatorId] || [];
      nominators[nominatorId].push({
        validatorId,
        validatorIndex
      });
    });
  });
  return {
    era,
    nominators,
    validators
  };
}
function _eraExposure(instanceId, api) {
  return (0, _util.memo)(instanceId, function (era) {
    let withActive = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    const [cacheKey, cached] = (0, _cache.getEraCache)(CACHE_KEY, era, withActive);
    return cached ? (0, _rxjs.of)(cached) : api.query.staking.erasStakersClipped.entries(era).pipe((0, _rxjs.map)(r => (0, _cache.setEraCache)(cacheKey, withActive, mapStakers(era, r))));
  });
}
const eraExposure = (0, _util2.singleEra)('_eraExposure');
exports.eraExposure = eraExposure;
const _erasExposure = (0, _util2.combineEras)('_eraExposure');
exports._erasExposure = _erasExposure;
const erasExposure = (0, _util2.erasHistoricApply)('_erasExposure');
exports.erasExposure = erasExposure;
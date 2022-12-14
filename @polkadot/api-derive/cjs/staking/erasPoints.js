"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._erasPoints = _erasPoints;
exports.erasPoints = void 0;
var _rxjs = require("rxjs");
var _util = require("@polkadot/util");
var _util2 = require("../util");
var _cache = require("./cache");
var _util3 = require("./util");
// Copyright 2017-2022 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

const CACHE_KEY = 'eraPoints';
function mapValidators(_ref) {
  let {
    individual
  } = _ref;
  return [...individual.entries()].filter(_ref2 => {
    let [, points] = _ref2;
    return points.gt(_util.BN_ZERO);
  }).reduce((result, _ref3) => {
    let [validatorId, points] = _ref3;
    result[validatorId.toString()] = points;
    return result;
  }, {});
}
function mapPoints(eras, points) {
  return eras.map((era, index) => ({
    era,
    eraPoints: points[index].total,
    validators: mapValidators(points[index])
  }));
}
function _erasPoints(instanceId, api) {
  return (0, _util2.memo)(instanceId, (eras, withActive) => {
    if (!eras.length) {
      return (0, _rxjs.of)([]);
    }
    const cached = (0, _cache.getEraMultiCache)(CACHE_KEY, eras, withActive);
    const remaining = (0, _util3.filterEras)(eras, cached);
    return !remaining.length ? (0, _rxjs.of)(cached) : api.query.staking.erasRewardPoints.multi(remaining).pipe((0, _rxjs.map)(p => (0, _cache.filterCachedEras)(eras, cached, (0, _cache.setEraMultiCache)(CACHE_KEY, withActive, mapPoints(remaining, p)))));
  });
}
const erasPoints = (0, _util3.erasHistoricApply)('_erasPoints');
exports.erasPoints = erasPoints;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._eraSlashes = _eraSlashes;
exports.erasSlashes = exports.eraSlashes = exports._erasSlashes = void 0;
var _rxjs = require("rxjs");
var _util = require("../util");
var _cache = require("./cache");
var _util2 = require("./util");
// Copyright 2017-2022 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

const CACHE_KEY = 'eraSlashes';
function mapSlashes(era, noms, vals) {
  const nominators = {};
  const validators = {};
  noms.forEach(_ref => {
    let [key, optBalance] = _ref;
    nominators[key.args[1].toString()] = optBalance.unwrap();
  });
  vals.forEach(_ref2 => {
    let [key, optRes] = _ref2;
    validators[key.args[1].toString()] = optRes.unwrapOrDefault()[1];
  });
  return {
    era,
    nominators,
    validators
  };
}
function _eraSlashes(instanceId, api) {
  return (0, _util.memo)(instanceId, (era, withActive) => {
    const [cacheKey, cached] = (0, _cache.getEraCache)(CACHE_KEY, era, withActive);
    return cached ? (0, _rxjs.of)(cached) : (0, _rxjs.combineLatest)([api.query.staking.nominatorSlashInEra.entries(era), api.query.staking.validatorSlashInEra.entries(era)]).pipe((0, _rxjs.map)(_ref3 => {
      let [n, v] = _ref3;
      return (0, _cache.setEraCache)(cacheKey, withActive, mapSlashes(era, n, v));
    }));
  });
}
const eraSlashes = (0, _util2.singleEra)('_eraSlashes');
exports.eraSlashes = eraSlashes;
const _erasSlashes = (0, _util2.combineEras)('_eraSlashes');
exports._erasSlashes = _erasSlashes;
const erasSlashes = (0, _util2.erasHistoricApply)('_erasSlashes');
exports.erasSlashes = erasSlashes;
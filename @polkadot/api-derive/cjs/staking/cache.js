"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.filterCachedEras = filterCachedEras;
exports.getEraCache = getEraCache;
exports.getEraMultiCache = getEraMultiCache;
exports.setEraCache = setEraCache;
exports.setEraMultiCache = setEraMultiCache;
var _util = require("../util");
// Copyright 2017-2022 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

function getEraCache(CACHE_KEY, era, withActive) {
  const cacheKey = `${CACHE_KEY}-${era.toString()}`;
  return [cacheKey, withActive ? undefined : _util.deriveCache.get(cacheKey)];
}
function getEraMultiCache(CACHE_KEY, eras, withActive) {
  const cached = withActive ? [] : eras.map(e => _util.deriveCache.get(`${CACHE_KEY}-${e.toString()}`)).filter(v => !!v);
  return cached;
}
function setEraCache(cacheKey, withActive, value) {
  !withActive && _util.deriveCache.set(cacheKey, value);
  return value;
}
function setEraMultiCache(CACHE_KEY, withActive, values) {
  !withActive && values.forEach(v => _util.deriveCache.set(`${CACHE_KEY}-${v.era.toString()}`, v));
  return values;
}
function filterCachedEras(eras, cached, query) {
  return eras.map(e => cached.find(_ref => {
    let {
      era
    } = _ref;
    return e.eq(era);
  }) || query.find(_ref2 => {
    let {
      era
    } = _ref2;
    return e.eq(era);
  }));
}
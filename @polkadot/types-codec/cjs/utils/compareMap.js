"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.compareMap = compareMap;
var _util = require("@polkadot/util");
var _util2 = require("./util");
// Copyright 2017-2022 @polkadot/types-codec authors & contributors
// SPDX-License-Identifier: Apache-2.0

function hasMismatch(a, b) {
  return (0, _util.isUndefined)(a) || ((0, _util2.hasEq)(a) ? !a.eq(b) : a !== b);
}
function notEntry(value) {
  return !Array.isArray(value) || value.length !== 2;
}
function compareMapArray(a, b) {
  // equal number of entries and each entry in the array should match
  return a.size === b.length && !b.some(e => notEntry(e) || hasMismatch(a.get(e[0]), e[1]));
}

// NOTE These are used internally and when comparing objects, expects that
// when the second is an Map<string, Codec> that the first has to be as well
function compareMap(a, b) {
  if (Array.isArray(b)) {
    return compareMapArray(a, b);
  } else if (b instanceof Map) {
    return compareMapArray(a, [...b.entries()]);
  } else if ((0, _util.isObject)(b)) {
    return compareMapArray(a, Object.entries(b));
  }
  return false;
}
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.compareArray = compareArray;
var _util = require("@polkadot/util");
var _util2 = require("./util");
// Copyright 2017-2022 @polkadot/types-codec authors & contributors
// SPDX-License-Identifier: Apache-2.0

// NOTE These are used internally and when comparing objects, expects that
// when the second is an Codec[] that the first has to be as well
function compareArray(a, b) {
  if (Array.isArray(b)) {
    return a.length === b.length && (0, _util.isUndefined)(a.find((v, index) => (0, _util2.hasEq)(v) ? !v.eq(b[index]) : v !== b[index]));
  }
  return false;
}
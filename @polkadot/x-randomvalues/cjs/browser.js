"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRandomValues = getRandomValues;
Object.defineProperty(exports, "packageInfo", {
  enumerable: true,
  get: function () {
    return _packageInfo.packageInfo;
  }
});
var _xGlobal = require("@polkadot/x-global");
var _packageInfo = require("./packageInfo");
// Copyright 2017-2022 @polkadot/x-randomvalues authors & contributors
// SPDX-License-Identifier: Apache-2.0

function getRandomValues(arr) {
  // We use x-global here - this prevents packagers such as rollup
  // confusing this with the "normal" Node.js import and stubbing it
  // (and also aligns with eg. x-fetch, where x-global is used)
  return _xGlobal.xglobal.crypto.getRandomValues(arr);
}
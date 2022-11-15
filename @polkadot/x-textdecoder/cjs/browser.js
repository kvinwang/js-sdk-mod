"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TextDecoder = void 0;
Object.defineProperty(exports, "packageInfo", {
  enumerable: true,
  get: function () {
    return _packageInfo.packageInfo;
  }
});
var _xGlobal = require("@polkadot/x-global");
var _fallback = require("./fallback");
var _packageInfo = require("./packageInfo");
// Copyright 2017-2022 @polkadot/x-textencoder authors & contributors
// SPDX-License-Identifier: Apache-2.0

const TextDecoder = (0, _xGlobal.extractGlobal)('TextDecoder', _fallback.TextDecoder);
exports.TextDecoder = TextDecoder;
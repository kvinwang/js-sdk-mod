"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetch = void 0;
Object.defineProperty(exports, "packageInfo", {
  enumerable: true,
  get: function () {
    return _packageInfo.packageInfo;
  }
});
var _xGlobal = require("@polkadot/x-global");
var _packageInfo = require("./packageInfo");
// Copyright 2017-2022 @polkadot/x-fetch authors & contributors
// SPDX-License-Identifier: Apache-2.0

const fetch = _xGlobal.xglobal.fetch;
exports.fetch = fetch;
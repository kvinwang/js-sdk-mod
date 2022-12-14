"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.prime = prime;
var _rxjs = require("rxjs");
var _util = require("@polkadot/util");
var _helpers = require("./helpers");
// Copyright 2017-2022 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

function prime(section) {
  return (0, _helpers.withSection)(section, query => () => (0, _util.isFunction)(query == null ? void 0 : query.prime) ? query.prime().pipe((0, _rxjs.map)(o => o.unwrapOr(null))) : (0, _rxjs.of)(null));
}
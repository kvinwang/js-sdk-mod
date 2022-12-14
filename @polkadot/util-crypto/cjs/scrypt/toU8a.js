"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.scryptToU8a = scryptToU8a;
var _util = require("@polkadot/util");
var _bn = require("../bn");
// Copyright 2017-2022 @polkadot/util-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

function scryptToU8a(salt, _ref) {
  let {
    N,
    p,
    r
  } = _ref;
  return (0, _util.u8aConcat)(salt, (0, _util.bnToU8a)(N, _bn.BN_LE_32_OPTS), (0, _util.bnToU8a)(p, _bn.BN_LE_32_OPTS), (0, _util.bnToU8a)(r, _bn.BN_LE_32_OPTS));
}
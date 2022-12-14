"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createKeyMulti = createKeyMulti;
var _util = require("@polkadot/util");
var _asU8a = require("../blake2/asU8a");
var _bn = require("../bn");
var _util2 = require("./util");
// Copyright 2017-2022 @polkadot/util-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

const PREFIX = (0, _util.stringToU8a)('modlpy/utilisuba');
function createKeyMulti(who, threshold) {
  return (0, _asU8a.blake2AsU8a)((0, _util.u8aConcat)(PREFIX, (0, _util.compactToU8a)(who.length), ...(0, _util.u8aSorted)(who.map(_util2.addressToU8a)), (0, _util.bnToU8a)(threshold, _bn.BN_LE_16_OPTS)));
}
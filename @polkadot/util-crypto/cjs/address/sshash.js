"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sshash = sshash;
var _util = require("@polkadot/util");
var _asU8a = require("../blake2/asU8a");
// Copyright 2017-2022 @polkadot/util-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

const SS58_PREFIX = (0, _util.stringToU8a)('SS58PRE');
function sshash(key) {
  return (0, _asU8a.blake2AsU8a)((0, _util.u8aConcat)(SS58_PREFIX, key), 512);
}
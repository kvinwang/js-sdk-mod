"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hasher = hasher;
var _blake = require("../blake2");
var _keccak = require("../keccak");
// Copyright 2017-2022 @polkadot/util-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

function hasher(hashType, data, onlyJs) {
  return hashType === 'keccak' ? (0, _keccak.keccakAsU8a)(data, undefined, onlyJs) : (0, _blake.blake2AsU8a)(data, undefined, undefined, onlyJs);
}
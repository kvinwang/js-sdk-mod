"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.keyFromPath = keyFromPath;
var _hdkdEcdsa = require("./hdkdEcdsa");
var _hdkdEd = require("./hdkdEd25519");
var _hdkdSr = require("./hdkdSr25519");
// Copyright 2017-2022 @polkadot/util-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

const generators = {
  ecdsa: _hdkdEcdsa.keyHdkdEcdsa,
  ed25519: _hdkdEd.keyHdkdEd25519,
  // FIXME This is Substrate-compatible, not Ethereum-compatible
  ethereum: _hdkdEcdsa.keyHdkdEcdsa,
  sr25519: _hdkdSr.keyHdkdSr25519
};
function keyFromPath(pair, path, type) {
  const keyHdkd = generators[type];
  let result = pair;
  for (const junction of path) {
    result = keyHdkd(result, junction);
  }
  return result;
}
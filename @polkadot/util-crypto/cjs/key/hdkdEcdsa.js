"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.keyHdkdEcdsa = void 0;
var _deriveHard = require("../secp256k1/deriveHard");
var _fromSeed = require("../secp256k1/pair/fromSeed");
var _hdkdDerive = require("./hdkdDerive");
// Copyright 2017-2022 @polkadot/util-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

const keyHdkdEcdsa = (0, _hdkdDerive.createSeedDeriveFn)(_fromSeed.secp256k1PairFromSeed, _deriveHard.secp256k1DeriveHard);
exports.keyHdkdEcdsa = keyHdkdEcdsa;
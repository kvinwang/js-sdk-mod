"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createDeriveFn = createDeriveFn;

var _util = require("@polkadot/util");

var _fromU8a = require("./pair/fromU8a");

var _toU8a = require("./pair/toU8a");

// Copyright 2017-2022 @polkadot/util-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0
function createDeriveFn(derive) {
  return (keypair, chainCode) => {
    if (!(0, _util.isU8a)(chainCode) || chainCode.length !== 32) {
      throw new Error('Invalid chainCode passed to derive');
    }

    return (0, _fromU8a.sr25519PairFromU8a)(derive((0, _toU8a.sr25519KeypairToU8a)(keypair), chainCode));
  };
}
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addressToU8a = addressToU8a;
var _decode = require("./decode");
// Copyright 2017-2022 @polkadot/util-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

function addressToU8a(who) {
  return (0, _decode.decodeAddress)(who);
}
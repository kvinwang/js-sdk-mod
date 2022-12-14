"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.encodeMultiAddress = encodeMultiAddress;
var _encode = require("./encode");
var _keyMulti = require("./keyMulti");
// Copyright 2017-2022 @polkadot/util-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

/**
 * @name encodeMultiAddress
 * @summary Creates a multisig address.
 * @description
 * Creates a Substrate multisig address based on the input address and the required threshold.
 */
function encodeMultiAddress(who, threshold, ss58Format) {
  return (0, _encode.encodeAddress)((0, _keyMulti.createKeyMulti)(who, threshold), ss58Format);
}
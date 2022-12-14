"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isEthereumAddress = isEthereumAddress;
var _util = require("@polkadot/util");
var _isChecksum = require("./isChecksum");
// Copyright 2017-2022 @polkadot/util-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

function isEthereumAddress(address) {
  if (!address || address.length !== 42 || !(0, _util.isHex)(address)) {
    return false;
  } else if (/^(0x)?[0-9a-f]{40}$/.test(address) || /^(0x)?[0-9A-F]{40}$/.test(address)) {
    return true;
  }
  return (0, _isChecksum.isEthereumChecksum)(address);
}
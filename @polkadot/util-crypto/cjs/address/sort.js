"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sortAddresses = sortAddresses;
var _util = require("@polkadot/util");
var _encode = require("./encode");
var _util2 = require("./util");
// Copyright 2017-2022 @polkadot/util authors & contributors
// SPDX-License-Identifier: Apache-2.0

function sortAddresses(addresses, ss58Format) {
  const u8aToAddress = u8a => (0, _encode.encodeAddress)(u8a, ss58Format);
  return (0, _util.u8aSorted)(addresses.map(_util2.addressToU8a)).map(u8aToAddress);
}
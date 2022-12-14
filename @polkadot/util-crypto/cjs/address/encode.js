"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.encodeAddress = encodeAddress;
var _util = require("@polkadot/util");
var _base = require("../base58");
var _decode = require("./decode");
var _defaults = require("./defaults");
var _sshash = require("./sshash");
// Copyright 2017-2022 @polkadot/util-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

// Original implementation: https://github.com/paritytech/polka-ui/blob/4858c094684769080f5811f32b081dd7780b0880/src/polkadot.js#L34

function encodeAddress(key) {
  let ss58Format = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _defaults.defaults.prefix;
  // decode it, this means we can re-encode an address
  const u8a = (0, _decode.decodeAddress)(key);
  if (ss58Format < 0 || ss58Format > 16383 || [46, 47].includes(ss58Format)) {
    throw new Error('Out of range ss58Format specified');
  } else if (!_defaults.defaults.allowedDecodedLengths.includes(u8a.length)) {
    throw new Error(`Expected a valid key to convert, with length ${_defaults.defaults.allowedDecodedLengths.join(', ')}`);
  }
  const input = (0, _util.u8aConcat)(ss58Format < 64 ? [ss58Format] : [(ss58Format & 0b0000000011111100) >> 2 | 0b01000000, ss58Format >> 8 | (ss58Format & 0b0000000000000011) << 6], u8a);
  return (0, _base.base58Encode)((0, _util.u8aConcat)(input, (0, _sshash.sshash)(input).subarray(0, [32, 33].includes(u8a.length) ? 2 : 1)));
}
"use strict";

require("@polkadot/x-bigint/cjs/shim");
var _secp256k = require("@noble/secp256k1");
var _util = require("@polkadot/util");
var _crypto = require("./crypto");
var _hmac = require("./hmac");
// Copyright 2017-2022 @polkadot/util-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

// Set overrides on the secp256k1 utils
//   - hmacShaSync - This needs to be set, unset by default
_secp256k.utils.hmacSha256Sync = function (key) {
  for (var _len = arguments.length, messages = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    messages[_key - 1] = arguments[_key];
  }
  return (0, _hmac.hmacSha256AsU8a)(key, (0, _util.u8aConcat)(...messages));
};

// start init process immediately
(0, _crypto.cryptoWaitReady)().catch(() => {
  // shouldn't happen, logged and caught inside cryptoWaitReady
});
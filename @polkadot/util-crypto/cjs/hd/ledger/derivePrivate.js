"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ledgerDerivePrivate = ledgerDerivePrivate;
var _util = require("@polkadot/util");
var _bn = require("../../bn");
var _hmac = require("../../hmac");
// Copyright 2017-2022 @polkadot/util-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

// performs hard-only derivation on the xprv
function ledgerDerivePrivate(xprv, index) {
  const kl = xprv.subarray(0, 32);
  const kr = xprv.subarray(32, 64);
  const cc = xprv.subarray(64, 96);
  const data = (0, _util.u8aConcat)([0], kl, kr, (0, _util.bnToU8a)(index, _bn.BN_LE_32_OPTS));
  const z = (0, _hmac.hmacShaAsU8a)(cc, data, 512);
  data[0] = 0x01;
  return (0, _util.u8aConcat)((0, _util.bnToU8a)((0, _util.u8aToBn)(kl, _bn.BN_LE_OPTS).iadd((0, _util.u8aToBn)(z.subarray(0, 28), _bn.BN_LE_OPTS).imul(_util.BN_EIGHT)), _bn.BN_LE_512_OPTS).subarray(0, 32), (0, _util.bnToU8a)((0, _util.u8aToBn)(kr, _bn.BN_LE_OPTS).iadd((0, _util.u8aToBn)(z.subarray(32, 64), _bn.BN_LE_OPTS)), _bn.BN_LE_512_OPTS).subarray(0, 32), (0, _hmac.hmacShaAsU8a)(cc, data, 512).subarray(32, 64));
}
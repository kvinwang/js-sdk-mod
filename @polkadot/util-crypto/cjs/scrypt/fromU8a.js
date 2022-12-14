"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.scryptFromU8a = scryptFromU8a;
var _util = require("@polkadot/util");
var _bn = require("../bn");
var _defaults = require("./defaults");
// Copyright 2017-2022 @polkadot/util-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

function scryptFromU8a(data) {
  const salt = data.subarray(0, 32);
  const N = (0, _util.u8aToBn)(data.subarray(32 + 0, 32 + 4), _bn.BN_LE_OPTS).toNumber();
  const p = (0, _util.u8aToBn)(data.subarray(32 + 4, 32 + 8), _bn.BN_LE_OPTS).toNumber();
  const r = (0, _util.u8aToBn)(data.subarray(32 + 8, 32 + 12), _bn.BN_LE_OPTS).toNumber();

  // FIXME At this moment we assume these to be fixed params, this is not a great idea since we lose flexibility
  // and updates for greater security. However we need some protection against carefully-crafted params that can
  // eat up CPU since these are user inputs. So we need to get very clever here, but atm we only allow the defaults
  // and if no match, bail out
  if (N !== _defaults.DEFAULT_PARAMS.N || p !== _defaults.DEFAULT_PARAMS.p || r !== _defaults.DEFAULT_PARAMS.r) {
    throw new Error('Invalid injected scrypt params found');
  }
  return {
    params: {
      N,
      p,
      r
    },
    salt
  };
}
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.keyExtractPath = keyExtractPath;
var _DeriveJunction = require("./DeriveJunction");
// Copyright 2017-2022 @polkadot/util-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

const RE_JUNCTION = /\/(\/?)([^/]+)/g;
/**
 * @description Extract derivation junctions from the supplied path
 */
function keyExtractPath(derivePath) {
  const parts = derivePath.match(RE_JUNCTION);
  const path = [];
  let constructed = '';
  if (parts) {
    constructed = parts.join('');
    for (const p of parts) {
      path.push(_DeriveJunction.DeriveJunction.from(p.substring(1)));
    }
  }
  if (constructed !== derivePath) {
    throw new Error(`Re-constructed path "${constructed}" does not match input`);
  }
  return {
    parts,
    path
  };
}
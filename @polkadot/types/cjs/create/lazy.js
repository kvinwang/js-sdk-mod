"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.lazyVariants = lazyVariants;
var _util = require("@polkadot/util");
// Copyright 2017-2022 @polkadot/types authors & contributors
// SPDX-License-Identifier: Apache-2.0

function lazyVariants(lookup, _ref, getName, creator) {
  let {
    type
  } = _ref;
  const result = {};
  const variants = lookup.getSiType(type).def.asVariant.variants;
  for (let i = 0; i < variants.length; i++) {
    (0, _util.lazyMethod)(result, variants[i], creator, getName, i);
  }
  return result;
}
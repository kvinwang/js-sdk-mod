"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateTypes = validateTypes;
var _util = require("@polkadot/util");
var _extractTypes = require("./extractTypes");
var _flattenUniq = require("./flattenUniq");
// Copyright 2017-2022 @polkadot/types authors & contributors
// SPDX-License-Identifier: Apache-2.0

const l = (0, _util.logger)('metadata');

/** @internal */
function validateTypes(registry, throwError, types) {
  const missing = (0, _flattenUniq.flattenUniq)((0, _extractTypes.extractTypes)(types)).filter(type => !registry.hasType(type) && !registry.isLookupType(type)).sort();
  if (missing.length !== 0) {
    const message = `Unknown types found, no types for ${missing.join(', ')}`;
    if (throwError) {
      throw new Error(message);
    } else {
      l.warn(message);
    }
  }
  return types;
}
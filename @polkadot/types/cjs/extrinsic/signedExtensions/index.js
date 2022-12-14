"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.allExtensions = void 0;
exports.expandExtensionTypes = expandExtensionTypes;
exports.fallbackExtensions = void 0;
exports.findUnknownExtensions = findUnknownExtensions;
var _util = require("@polkadot/util");
var _polkadot = require("./polkadot");
var _shell = require("./shell");
var _statemint = require("./statemint");
var _substrate = require("./substrate");
// Copyright 2017-2022 @polkadot/types authors & contributors
// SPDX-License-Identifier: Apache-2.0

// A mapping of the known signed extensions to the extra fields that they
// contain. Unlike in the actual extensions, we define the extra fields not
// as a Tuple, but rather as a struct so they can be named. These will be
// expanded into the various fields when added to the payload (we only
// support V4 onwards with these, V3 and earlier are deemed fixed))
const allExtensions = (0, _util.objectSpread)({}, _substrate.substrate, _polkadot.polkadot, _shell.shell, _statemint.statemint);

// the v4 signed extensions prior to the point of exposing these to the
// metadata. This may not match 100% with the current defaults and are used
// when not specified in the metadata (which is for very old chains). The
// order is important here, as applied by default
exports.allExtensions = allExtensions;
const fallbackExtensions = ['CheckVersion', 'CheckGenesis', 'CheckEra', 'CheckNonce', 'CheckWeight', 'ChargeTransactionPayment', 'CheckBlockGasLimit'];
exports.fallbackExtensions = fallbackExtensions;
function findUnknownExtensions(extensions) {
  let userExtensions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  const names = [...Object.keys(allExtensions), ...Object.keys(userExtensions)];
  return extensions.filter(k => !names.includes(k));
}
function expandExtensionTypes(extensions, type) {
  let userExtensions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return extensions
  // Always allow user extensions first - these should provide overrides
  .map(k => userExtensions[k] || allExtensions[k]).filter(info => !!info).reduce((result, info) => (0, _util.objectSpread)(result, info[type]), {});
}
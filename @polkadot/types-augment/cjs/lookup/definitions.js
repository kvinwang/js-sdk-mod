"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _util = require("@polkadot/util");
var _kusama = _interopRequireDefault(require("./kusama"));
var _polkadot = _interopRequireDefault(require("./polkadot"));
var _substrate = _interopRequireDefault(require("./substrate"));
// Copyright 2017-2022 @polkadot/types-lookup authors & contributors
// SPDX-License-Identifier: Apache-2.0
var _default = {
  rpc: {},
  // Not 100% sure it is relevant, however the order here is the same
  // as exposed in the typegen lookup order
  types: (0, _util.objectSpread)({}, _substrate.default, _polkadot.default, _kusama.default)
};
exports.default = _default;
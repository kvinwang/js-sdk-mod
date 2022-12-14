"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _centrifugeChain = _interopRequireDefault(require("./centrifuge-chain"));
var _kusama = _interopRequireDefault(require("./kusama"));
var _node = _interopRequireDefault(require("./node"));
var _nodeTemplate = _interopRequireDefault(require("./node-template"));
var _polkadot = _interopRequireDefault(require("./polkadot"));
var _rococo = _interopRequireDefault(require("./rococo"));
var _shell = _interopRequireDefault(require("./shell"));
var _statemint = _interopRequireDefault(require("./statemint"));
var _westend = _interopRequireDefault(require("./westend"));
// Copyright 2017-2022 @polkadot/types-known authors & contributors
// SPDX-License-Identifier: Apache-2.0

// Type overrides for specific spec types & versions as given in runtimeVersion
const typesSpec = {
  'centrifuge-chain': _centrifugeChain.default,
  kusama: _kusama.default,
  node: _node.default,
  'node-template': _nodeTemplate.default,
  polkadot: _polkadot.default,
  rococo: _rococo.default,
  shell: _shell.default,
  statemine: _statemint.default,
  statemint: _statemint.default,
  westend: _westend.default,
  westmint: _statemint.default
};
var _default = typesSpec;
exports.default = _default;
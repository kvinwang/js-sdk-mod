"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setSS58Format = setSS58Format;
var _util = require("@polkadot/util");
var _defaults = require("./defaults");
// Copyright 2017-2022 @polkadot/util-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

const l = (0, _util.logger)('setSS58Format');

/**
 * @description Sets the global SS58 format to use for address encoding
 * @deprecated Use keyring.setSS58Format
 */
function setSS58Format(prefix) {
  l.warn('Global setting of the ss58Format is deprecated and not recommended. Set format on the keyring (if used) or as part of the address encode function');
  _defaults.defaults.prefix = prefix;
}
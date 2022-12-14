"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isAddress = isAddress;
var _validate = require("./validate");
// Copyright 2017-2022 @polkadot/util-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

function isAddress(address, ignoreChecksum, ss58Format) {
  try {
    return (0, _validate.validateAddress)(address, ignoreChecksum, ss58Format);
  } catch (error) {
    return false;
  }
}
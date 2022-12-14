"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.jsonEncryptFormat = jsonEncryptFormat;
var _base = require("../base64");
var _constants = require("./constants");
// Copyright 2017-2022 @polkadot/util-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

function jsonEncryptFormat(encoded, contentType, isEncrypted) {
  return {
    encoded: (0, _base.base64Encode)(encoded),
    encoding: {
      content: contentType,
      type: isEncrypted ? _constants.ENCODING : _constants.ENCODING_NONE,
      version: _constants.ENCODING_VERSION
    }
  };
}
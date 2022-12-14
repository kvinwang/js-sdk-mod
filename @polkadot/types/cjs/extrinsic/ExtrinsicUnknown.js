"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GenericExtrinsicUnknown = void 0;
var _typesCodec = require("@polkadot/types-codec");
var _constants = require("./constants");
// Copyright 2017-2022 @polkadot/types authors & contributors
// SPDX-License-Identifier: Apache-2.0

/**
 * @name GenericExtrinsicUnknown
 * @description
 * A default handler for extrinsics where the version is not known (default throw)
 */
class GenericExtrinsicUnknown extends _typesCodec.Struct {
  constructor(registry, value) {
    let {
      isSigned = false,
      version = 0
    } = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    super(registry, {});
    throw new Error(`Unsupported ${isSigned ? '' : 'un'}signed extrinsic version ${version & _constants.UNMASK_VERSION}`);
  }
}
exports.GenericExtrinsicUnknown = GenericExtrinsicUnknown;
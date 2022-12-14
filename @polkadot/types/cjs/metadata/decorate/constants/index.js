"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.decorateConstants = decorateConstants;
var _util = require("@polkadot/util");
var _util2 = require("../util");
// Copyright 2017-2022 @polkadot/types authors & contributors
// SPDX-License-Identifier: Apache-2.0

/** @internal */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function decorateConstants(registry, _ref, _version) {
  let {
    pallets
  } = _ref;
  const result = {};
  for (let i = 0; i < pallets.length; i++) {
    const {
      constants,
      name
    } = pallets[i];
    if (!constants.isEmpty) {
      (0, _util.lazyMethod)(result, (0, _util.stringCamelCase)(name), () => (0, _util.lazyMethods)({}, constants, constant => {
        const codec = registry.createTypeUnsafe(registry.createLookupType(constant.type), [(0, _util.hexToU8a)(constant.value.toHex())]);
        codec.meta = constant;
        return codec;
      }, _util2.objectNameToCamel));
    }
  }
  return result;
}
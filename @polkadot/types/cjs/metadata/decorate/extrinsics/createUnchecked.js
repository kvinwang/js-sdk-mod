"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createUnchecked = createUnchecked;
var _util = require("@polkadot/util");
// Copyright 2017-2022 @polkadot/types authors & contributors
// SPDX-License-Identifier: Apache-2.0

function isTx(tx, callIndex) {
  return tx.callIndex[0] === callIndex[0] && tx.callIndex[1] === callIndex[1];
}

/** @internal */
function createUnchecked(registry, section, callIndex, callMetadata) {
  const expectedArgs = callMetadata.fields;
  const funcName = (0, _util.stringCamelCase)(callMetadata.name);
  const extrinsicFn = function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    if (expectedArgs.length !== args.length) {
      throw new Error(`Extrinsic ${section}.${funcName} expects ${expectedArgs.length} arguments, got ${args.length}.`);
    }
    return registry.createTypeUnsafe('Call', [{
      args,
      callIndex
    }, callMetadata]);
  };
  extrinsicFn.is = tx => isTx(tx, callIndex);
  extrinsicFn.callIndex = callIndex;
  extrinsicFn.meta = callMetadata;
  extrinsicFn.method = funcName;
  extrinsicFn.section = section;
  extrinsicFn.toJSON = () => callMetadata.toJSON();
  return extrinsicFn;
}
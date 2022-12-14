"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createCallFunction = createCallFunction;
exports.decorateExtrinsics = decorateExtrinsics;
exports.filterCallsSome = filterCallsSome;
var _util = require("@polkadot/util");
var _lazy = require("../../../create/lazy");
var _util2 = require("../../util");
var _util3 = require("../util");
var _createUnchecked = require("./createUnchecked");
// Copyright 2017-2022 @polkadot/types authors & contributors
// SPDX-License-Identifier: Apache-2.0

function filterCallsSome(_ref) {
  let {
    calls
  } = _ref;
  return calls.isSome;
}
function createCallFunction(registry, lookup, variant, sectionName, sectionIndex) {
  const {
    fields,
    index
  } = variant;
  const args = new Array(fields.length);
  for (let a = 0; a < fields.length; a++) {
    const {
      name,
      type,
      typeName
    } = fields[a];
    args[a] = (0, _util.objectSpread)({
      name: (0, _util.stringCamelCase)(name.unwrapOr(`param${a}`)),
      type: (0, _util2.getSiName)(lookup, type)
    }, typeName.isSome ? {
      typeName: typeName.unwrap()
    } : null);
  }
  return (0, _createUnchecked.createUnchecked)(registry, sectionName, new Uint8Array([sectionIndex, index.toNumber()]), registry.createTypeUnsafe('FunctionMetadataLatest', [(0, _util.objectSpread)({
    args
  }, variant)]));
}

/** @internal */
function decorateExtrinsics(registry, _ref2, version) {
  let {
    lookup,
    pallets
  } = _ref2;
  const result = {};
  const filtered = pallets.filter(filterCallsSome);
  for (let i = 0; i < filtered.length; i++) {
    const {
      calls,
      index,
      name
    } = filtered[i];
    const sectionName = (0, _util.stringCamelCase)(name);
    const sectionIndex = version >= 12 ? index.toNumber() : i;
    (0, _util.lazyMethod)(result, sectionName, () => (0, _lazy.lazyVariants)(lookup, calls.unwrap(), _util3.objectNameToCamel, variant => createCallFunction(registry, lookup, variant, sectionName, sectionIndex)));
  }
  return result;
}
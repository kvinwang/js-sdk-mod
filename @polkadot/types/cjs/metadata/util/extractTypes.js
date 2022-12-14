"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extractTypes = extractTypes;
var _typesCreate = require("@polkadot/types-create");
// Copyright 2017-2022 @polkadot/types authors & contributors
// SPDX-License-Identifier: Apache-2.0

function extractSubSingle(_, _ref) {
  let {
    sub
  } = _ref;
  const {
    lookupName,
    type
  } = sub;
  return extractTypes([lookupName || type]);
}
function extractSubArray(_, _ref2) {
  let {
    sub
  } = _ref2;
  return extractTypes(sub.map(_ref3 => {
    let {
      lookupName,
      type
    } = _ref3;
    return lookupName || type;
  }));
}
function unhandled(type, _ref4) {
  let {
    info
  } = _ref4;
  throw new Error(`Unhandled: Unable to create and validate type from ${type} (info=${_typesCreate.TypeDefInfo[info]})`);
}

// we only handle the types with params here
const mapping = {
  [_typesCreate.TypeDefInfo.BTreeMap]: extractSubArray,
  [_typesCreate.TypeDefInfo.BTreeSet]: extractSubSingle,
  [_typesCreate.TypeDefInfo.Compact]: extractSubSingle,
  [_typesCreate.TypeDefInfo.DoNotConstruct]: unhandled,
  [_typesCreate.TypeDefInfo.Enum]: extractSubArray,
  [_typesCreate.TypeDefInfo.HashMap]: extractSubArray,
  [_typesCreate.TypeDefInfo.Int]: unhandled,
  [_typesCreate.TypeDefInfo.Linkage]: extractSubSingle,
  [_typesCreate.TypeDefInfo.Null]: unhandled,
  [_typesCreate.TypeDefInfo.Option]: extractSubSingle,
  [_typesCreate.TypeDefInfo.Plain]: (_, typeDef) => typeDef.lookupName || typeDef.type,
  [_typesCreate.TypeDefInfo.Range]: extractSubSingle,
  [_typesCreate.TypeDefInfo.RangeInclusive]: extractSubSingle,
  [_typesCreate.TypeDefInfo.Result]: extractSubArray,
  [_typesCreate.TypeDefInfo.Set]: extractSubArray,
  [_typesCreate.TypeDefInfo.Si]: unhandled,
  [_typesCreate.TypeDefInfo.Struct]: extractSubArray,
  [_typesCreate.TypeDefInfo.Tuple]: extractSubArray,
  [_typesCreate.TypeDefInfo.UInt]: unhandled,
  [_typesCreate.TypeDefInfo.Vec]: extractSubSingle,
  [_typesCreate.TypeDefInfo.VecFixed]: extractSubSingle,
  [_typesCreate.TypeDefInfo.WrapperKeepOpaque]: extractSubSingle,
  [_typesCreate.TypeDefInfo.WrapperOpaque]: extractSubSingle
};

/** @internal */
function extractTypes(types) {
  const count = types.length;
  const result = new Array(count);
  for (let i = 0; i < count; i++) {
    const type = types[i];
    const typeDef = (0, _typesCreate.getTypeDef)(type);
    result[i] = mapping[typeDef.info](type, typeDef);
  }
  return result;
}
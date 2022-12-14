"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTypeDef = getTypeDef;
var _typesCodec = require("@polkadot/types-codec");
var _util = require("@polkadot/util");
var _types = require("../types");
var _typeSplit = require("./typeSplit");
// Copyright 2017-2022 @polkadot/types-create authors & contributors
// SPDX-License-Identifier: Apache-2.0

const KNOWN_INTERNALS = ['_alias', '_fallback'];
function getTypeString(typeOrObj) {
  return (0, _util.isString)(typeOrObj) ? typeOrObj.toString() : JSON.stringify(typeOrObj);
}
function isRustEnum(details) {
  const values = Object.values(details);
  if (values.some(v => (0, _util.isNumber)(v))) {
    if (!values.every(v => (0, _util.isNumber)(v) && v >= 0 && v <= 255)) {
      throw new Error('Invalid number-indexed enum definition');
    }
    return false;
  }
  return true;
}

// decode an enum of either of the following forms
//  { _enum: ['A', 'B', 'C'] }
//  { _enum: { A: AccountId, B: Balance, C: u32 } }
//  { _enum: { A: 1, B: 2 } }
function _decodeEnum(value, details, count, fallbackType) {
  value.info = _types.TypeDefInfo.Enum;
  value.fallbackType = fallbackType;

  // not as pretty, but remain compatible with oo7 for both struct and Array types
  if (Array.isArray(details)) {
    value.sub = details.map((name, index) => ({
      index,
      info: _types.TypeDefInfo.Plain,
      name,
      type: 'Null'
    }));
  } else if (isRustEnum(details)) {
    value.sub = Object.entries(details).map((_ref, index) => {
      let [name, typeOrObj] = _ref;
      return (0, _util.objectSpread)({}, getTypeDef(getTypeString(typeOrObj || 'Null'), {
        name
      }, count), {
        index
      });
    });
  } else {
    value.sub = Object.entries(details).map(_ref2 => {
      let [name, index] = _ref2;
      return {
        index,
        info: _types.TypeDefInfo.Plain,
        name,
        type: 'Null'
      };
    });
  }
  return value;
}

// decode a set of the form
//   { _set: { A: 0b0001, B: 0b0010, C: 0b0100 } }
function _decodeSet(value, details, fallbackType) {
  value.info = _types.TypeDefInfo.Set;
  value.fallbackType = fallbackType;
  value.length = details._bitLength;
  value.sub = Object.entries(details).filter(_ref3 => {
    let [name] = _ref3;
    return !name.startsWith('_');
  }).map(_ref4 => {
    let [name, index] = _ref4;
    return {
      index,
      info: _types.TypeDefInfo.Plain,
      name,
      type: 'Null'
    };
  });
  return value;
}

// decode a struct, set or enum
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function _decodeStruct(value, type, _, count) {
  const parsed = JSON.parse(type);
  const keys = Object.keys(parsed);
  if (keys.includes('_enum')) {
    return _decodeEnum(value, parsed._enum, count, parsed._fallback);
  } else if (keys.includes('_set')) {
    return _decodeSet(value, parsed._set, parsed._fallback);
  }
  value.alias = parsed._alias ? new Map(Object.entries(parsed._alias)) : undefined;
  value.fallbackType = parsed._fallback;
  value.sub = keys.filter(name => !KNOWN_INTERNALS.includes(name)).map(name => getTypeDef(getTypeString(parsed[name]), {
    name
  }, count));
  return value;
}

// decode a fixed vector, e.g. [u8;32]
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function _decodeFixedVec(value, type, _, count) {
  const max = type.length - 1;
  let index = -1;
  let inner = 0;
  for (let i = 1; i < max && index === -1; i++) {
    switch (type[i]) {
      case ';':
        {
          if (inner === 0) {
            index = i;
          }
          break;
        }
      case '[':
      case '(':
      case '<':
        inner++;
        break;
      case ']':
      case ')':
      case '>':
        inner--;
        break;
    }
  }
  if (index === -1) {
    throw new Error(`${type}: Unable to extract location of ';'`);
  }
  const vecType = type.substring(1, index);
  const [strLength, displayName] = type.substring(index + 1, max).split(';');
  const length = parseInt(strLength.trim(), 10);
  if (length > 2048) {
    throw new Error(`${type}: Only support for [Type; <length>], where length <= 2048`);
  }
  value.displayName = displayName;
  value.length = length;
  value.sub = getTypeDef(vecType, {}, count);
  return value;
}

// decode a tuple
function _decodeTuple(value, _, subType, count) {
  value.sub = subType.length === 0 ? [] : (0, _typeSplit.typeSplit)(subType).map(inner => getTypeDef(inner, {}, count));
  return value;
}

// decode a Int/UInt<bitLength[, name]>
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function _decodeAnyInt(value, type, _, clazz) {
  const [strLength, displayName] = type.substring(clazz.length + 1, type.length - 1).split(',');
  const length = parseInt(strLength.trim(), 10);
  if (length > 8192 || length % 8) {
    throw new Error(`${type}: Only support for ${clazz}<bitLength>, where length <= 8192 and a power of 8, found ${length}`);
  }
  value.displayName = displayName;
  value.length = length;
  return value;
}
function _decodeInt(value, type, subType) {
  return _decodeAnyInt(value, type, subType, 'Int');
}
function _decodeUInt(value, type, subType) {
  return _decodeAnyInt(value, type, subType, 'UInt');
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function _decodeDoNotConstruct(value, type, _) {
  const NAME_LENGTH = 'DoNotConstruct'.length;
  value.displayName = type.substring(NAME_LENGTH + 1, type.length - 1);
  return value;
}
function hasWrapper(type, _ref5) {
  let [start, end] = _ref5;
  return type.substring(0, start.length) === start && type.slice(-1 * end.length) === end;
}
const nestedExtraction = [['[', ']', _types.TypeDefInfo.VecFixed, _decodeFixedVec], ['{', '}', _types.TypeDefInfo.Struct, _decodeStruct], ['(', ')', _types.TypeDefInfo.Tuple, _decodeTuple],
// the inner for these are the same as tuple, multiple values
['BTreeMap<', '>', _types.TypeDefInfo.BTreeMap, _decodeTuple], ['HashMap<', '>', _types.TypeDefInfo.HashMap, _decodeTuple], ['Int<', '>', _types.TypeDefInfo.Int, _decodeInt], ['Result<', '>', _types.TypeDefInfo.Result, _decodeTuple], ['UInt<', '>', _types.TypeDefInfo.UInt, _decodeUInt], ['DoNotConstruct<', '>', _types.TypeDefInfo.DoNotConstruct, _decodeDoNotConstruct]];
const wrappedExtraction = [['BTreeSet<', '>', _types.TypeDefInfo.BTreeSet], ['Compact<', '>', _types.TypeDefInfo.Compact], ['Linkage<', '>', _types.TypeDefInfo.Linkage], ['Opaque<', '>', _types.TypeDefInfo.WrapperOpaque], ['Option<', '>', _types.TypeDefInfo.Option], ['Range<', '>', _types.TypeDefInfo.Range], ['RangeInclusive<', '>', _types.TypeDefInfo.RangeInclusive], ['Vec<', '>', _types.TypeDefInfo.Vec], ['WrapperKeepOpaque<', '>', _types.TypeDefInfo.WrapperKeepOpaque], ['WrapperOpaque<', '>', _types.TypeDefInfo.WrapperOpaque]];
function extractSubType(type, _ref6) {
  let [start, end] = _ref6;
  return type.substring(start.length, type.length - end.length);
}
function getTypeDef(_type) {
  let {
    displayName,
    name
  } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  let count = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  // create the type via Type, allowing types to be sanitized
  const type = (0, _typesCodec.sanitize)(_type);
  const value = {
    displayName,
    info: _types.TypeDefInfo.Plain,
    name,
    type
  };
  if (++count > 64) {
    throw new Error('getTypeDef: Maximum nested limit reached');
  }
  const nested = nestedExtraction.find(nested => hasWrapper(type, nested));
  if (nested) {
    value.info = nested[2];
    return nested[3](value, type, extractSubType(type, nested), count);
  }
  const wrapped = wrappedExtraction.find(wrapped => hasWrapper(type, wrapped));
  if (wrapped) {
    value.info = wrapped[2];
    value.sub = getTypeDef(extractSubType(type, wrapped), {}, count);
  }
  return value;
}
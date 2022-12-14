"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.constructTypeClass = constructTypeClass;
exports.createClassUnsafe = createClassUnsafe;
exports.getTypeClass = getTypeClass;
var _typesCodec = require("@polkadot/types-codec");
var _util = require("@polkadot/util");
var _types = require("../types");
var _getTypeDef = require("../util/getTypeDef");
// Copyright 2017-2022 @polkadot/types-create authors & contributors
// SPDX-License-Identifier: Apache-2.0

function getTypeDefType(_ref) {
  let {
    lookupName,
    type
  } = _ref;
  return lookupName || type;
}
function getSubDefArray(value) {
  if (!Array.isArray(value.sub)) {
    throw new Error(`Expected subtype as TypeDef[] in ${(0, _util.stringify)(value)}`);
  }
  return value.sub;
}
function getSubDef(value) {
  if (!value.sub || Array.isArray(value.sub)) {
    throw new Error(`Expected subtype as TypeDef in ${(0, _util.stringify)(value)}`);
  }
  return value.sub;
}
function getSubType(value) {
  return getTypeDefType(getSubDef(value));
}

// create a maps of type string CodecClasss from the input
function getTypeClassMap(value) {
  const subs = getSubDefArray(value);
  const map = {};
  for (let i = 0; i < subs.length; i++) {
    map[subs[i].name] = getTypeDefType(subs[i]);
  }
  return map;
}

// create an array of type string CodecClasss from the input
function getTypeClassArray(value) {
  return getSubDefArray(value).map(getTypeDefType);
}
function createInt(Clazz, _ref2) {
  let {
    displayName,
    length
  } = _ref2;
  if (!(0, _util.isNumber)(length)) {
    throw new Error(`Expected bitLength information for ${displayName || Clazz.constructor.name}<bitLength>`);
  }
  return Clazz.with(length, displayName);
}
function createHashMap(Clazz, value) {
  const [keyType, valueType] = getTypeClassArray(value);
  return Clazz.with(keyType, valueType);
}
function createWithSub(Clazz, value) {
  return Clazz.with(getSubType(value));
}
const infoMapping = {
  [_types.TypeDefInfo.BTreeMap]: (registry, value) => createHashMap(_typesCodec.BTreeMap, value),
  [_types.TypeDefInfo.BTreeSet]: (registry, value) => createWithSub(_typesCodec.BTreeSet, value),
  [_types.TypeDefInfo.Compact]: (registry, value) => createWithSub(_typesCodec.Compact, value),
  [_types.TypeDefInfo.DoNotConstruct]: (registry, value) => _typesCodec.DoNotConstruct.with(value.displayName || value.type),
  [_types.TypeDefInfo.Enum]: (registry, value) => {
    const subs = getSubDefArray(value);
    return _typesCodec.Enum.with(subs.every(_ref3 => {
      let {
        type
      } = _ref3;
      return type === 'Null';
    }) ? subs.reduce((out, _ref4, count) => {
      let {
        index,
        name
      } = _ref4;
      out[name] = index || count;
      return out;
    }, {}) : getTypeClassMap(value));
  },
  [_types.TypeDefInfo.HashMap]: (registry, value) => createHashMap(_typesCodec.HashMap, value),
  [_types.TypeDefInfo.Int]: (registry, value) => createInt(_typesCodec.Int, value),
  // We have circular deps between Linkage & Struct
  [_types.TypeDefInfo.Linkage]: (registry, value) => {
    const type = `Option<${getSubType(value)}>`;
    // eslint-disable-next-line sort-keys
    const Clazz = _typesCodec.Struct.with({
      previous: type,
      next: type
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    Clazz.prototype.toRawType = function () {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call
      return `Linkage<${this.next.toRawType(true)}>`;
    };
    return Clazz;
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  [_types.TypeDefInfo.Null]: (registry, _) => _typesCodec.Null,
  [_types.TypeDefInfo.Option]: (registry, value) => {
    if (!value.sub || Array.isArray(value.sub)) {
      throw new Error('Expected type information for Option');
    }

    // NOTE This is opt-in (unhandled), not by default
    // if (value.sub.type === 'bool') {
    //   return OptionBool;
    // }

    return createWithSub(_typesCodec.Option, value);
  },
  [_types.TypeDefInfo.Plain]: (registry, value) => registry.getOrUnknown(value.type),
  [_types.TypeDefInfo.Range]: (registry, value) => createWithSub(_typesCodec.Range, value),
  [_types.TypeDefInfo.RangeInclusive]: (registry, value) => createWithSub(_typesCodec.RangeInclusive, value),
  [_types.TypeDefInfo.Result]: (registry, value) => {
    const [Ok, Err] = getTypeClassArray(value);

    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    return _typesCodec.Result.with({
      Err,
      Ok
    });
  },
  [_types.TypeDefInfo.Set]: (registry, value) => _typesCodec.CodecSet.with(getSubDefArray(value).reduce((result, _ref5) => {
    let {
      index,
      name
    } = _ref5;
    result[name] = index;
    return result;
  }, {}), value.length),
  [_types.TypeDefInfo.Si]: (registry, value) => getTypeClass(registry, registry.lookup.getTypeDef(value.type)),
  [_types.TypeDefInfo.Struct]: (registry, value) => _typesCodec.Struct.with(getTypeClassMap(value), value.alias),
  [_types.TypeDefInfo.Tuple]: (registry, value) => _typesCodec.Tuple.with(getTypeClassArray(value)),
  [_types.TypeDefInfo.UInt]: (registry, value) => createInt(_typesCodec.UInt, value),
  [_types.TypeDefInfo.Vec]: (registry, _ref6) => {
    let {
      sub
    } = _ref6;
    if (!sub || Array.isArray(sub)) {
      throw new Error('Expected type information for vector');
    }
    return sub.type === 'u8' ? _typesCodec.Bytes : _typesCodec.Vec.with(getTypeDefType(sub));
  },
  [_types.TypeDefInfo.VecFixed]: (registry, _ref7) => {
    let {
      displayName,
      length,
      sub
    } = _ref7;
    if (!(0, _util.isNumber)(length) || !sub || Array.isArray(sub)) {
      throw new Error('Expected length & type information for fixed vector');
    }
    return sub.type === 'u8' ? _typesCodec.U8aFixed.with(length * 8, displayName) : _typesCodec.VecFixed.with(getTypeDefType(sub), length);
  },
  [_types.TypeDefInfo.WrapperKeepOpaque]: (registry, value) => createWithSub(_typesCodec.WrapperKeepOpaque, value),
  [_types.TypeDefInfo.WrapperOpaque]: (registry, value) => createWithSub(_typesCodec.WrapperOpaque, value)
};
function constructTypeClass(registry, typeDef) {
  try {
    const Type = infoMapping[typeDef.info](registry, typeDef);
    if (!Type) {
      throw new Error('No class created');
    }

    // don't clobber any existing
    if (!Type.__fallbackType && typeDef.fallbackType) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore ...this is the only place we we actually assign this...
      Type.__fallbackType = typeDef.fallbackType;
    }
    return Type;
  } catch (error) {
    throw new Error(`Unable to construct class from ${(0, _util.stringify)(typeDef)}: ${error.message}`);
  }
}

// Returns the type Class for construction
function getTypeClass(registry, typeDef) {
  return registry.getUnsafe(typeDef.type, false, typeDef);
}
function createClassUnsafe(registry, type) {
  return (
    // just retrieve via name, no creation via typeDef
    registry.getUnsafe(type) ||
    // we don't have an existing type, create the class via typeDef
    getTypeClass(registry, registry.isLookupType(type) ? registry.lookup.getTypeDef(type) : (0, _getTypeDef.getTypeDef)(type))
  );
}
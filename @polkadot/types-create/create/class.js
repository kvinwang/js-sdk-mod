// Copyright 2017-2022 @polkadot/types-create authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { BTreeMap, BTreeSet, Bytes, CodecSet, Compact, DoNotConstruct, Enum, HashMap, Int, Null, Option, Range, RangeInclusive, Result, Struct, Tuple, U8aFixed, UInt, Vec, VecFixed, WrapperKeepOpaque, WrapperOpaque } from '@polkadot/types-codec';
import { isNumber, stringify } from '@polkadot/util';
import { TypeDefInfo } from "../types/index.js";
import { getTypeDef } from "../util/getTypeDef.js";
function getTypeDefType({
  lookupName,
  type
}) {
  return lookupName || type;
}
function getSubDefArray(value) {
  if (!Array.isArray(value.sub)) {
    throw new Error(`Expected subtype as TypeDef[] in ${stringify(value)}`);
  }
  return value.sub;
}
function getSubDef(value) {
  if (!value.sub || Array.isArray(value.sub)) {
    throw new Error(`Expected subtype as TypeDef in ${stringify(value)}`);
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
function createInt(Clazz, {
  displayName,
  length
}) {
  if (!isNumber(length)) {
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
  [TypeDefInfo.BTreeMap]: (registry, value) => createHashMap(BTreeMap, value),
  [TypeDefInfo.BTreeSet]: (registry, value) => createWithSub(BTreeSet, value),
  [TypeDefInfo.Compact]: (registry, value) => createWithSub(Compact, value),
  [TypeDefInfo.DoNotConstruct]: (registry, value) => DoNotConstruct.with(value.displayName || value.type),
  [TypeDefInfo.Enum]: (registry, value) => {
    const subs = getSubDefArray(value);
    return Enum.with(subs.every(({
      type
    }) => type === 'Null') ? subs.reduce((out, {
      index,
      name
    }, count) => {
      out[name] = index || count;
      return out;
    }, {}) : getTypeClassMap(value));
  },
  [TypeDefInfo.HashMap]: (registry, value) => createHashMap(HashMap, value),
  [TypeDefInfo.Int]: (registry, value) => createInt(Int, value),
  // We have circular deps between Linkage & Struct
  [TypeDefInfo.Linkage]: (registry, value) => {
    const type = `Option<${getSubType(value)}>`;
    // eslint-disable-next-line sort-keys
    const Clazz = Struct.with({
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
  [TypeDefInfo.Null]: (registry, _) => Null,
  [TypeDefInfo.Option]: (registry, value) => {
    if (!value.sub || Array.isArray(value.sub)) {
      throw new Error('Expected type information for Option');
    }

    // NOTE This is opt-in (unhandled), not by default
    // if (value.sub.type === 'bool') {
    //   return OptionBool;
    // }

    return createWithSub(Option, value);
  },
  [TypeDefInfo.Plain]: (registry, value) => registry.getOrUnknown(value.type),
  [TypeDefInfo.Range]: (registry, value) => createWithSub(Range, value),
  [TypeDefInfo.RangeInclusive]: (registry, value) => createWithSub(RangeInclusive, value),
  [TypeDefInfo.Result]: (registry, value) => {
    const [Ok, Err] = getTypeClassArray(value);

    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    return Result.with({
      Err,
      Ok
    });
  },
  [TypeDefInfo.Set]: (registry, value) => CodecSet.with(getSubDefArray(value).reduce((result, {
    index,
    name
  }) => {
    result[name] = index;
    return result;
  }, {}), value.length),
  [TypeDefInfo.Si]: (registry, value) => getTypeClass(registry, registry.lookup.getTypeDef(value.type)),
  [TypeDefInfo.Struct]: (registry, value) => Struct.with(getTypeClassMap(value), value.alias),
  [TypeDefInfo.Tuple]: (registry, value) => Tuple.with(getTypeClassArray(value)),
  [TypeDefInfo.UInt]: (registry, value) => createInt(UInt, value),
  [TypeDefInfo.Vec]: (registry, {
    sub
  }) => {
    if (!sub || Array.isArray(sub)) {
      throw new Error('Expected type information for vector');
    }
    return sub.type === 'u8' ? Bytes : Vec.with(getTypeDefType(sub));
  },
  [TypeDefInfo.VecFixed]: (registry, {
    displayName,
    length,
    sub
  }) => {
    if (!isNumber(length) || !sub || Array.isArray(sub)) {
      throw new Error('Expected length & type information for fixed vector');
    }
    return sub.type === 'u8' ? U8aFixed.with(length * 8, displayName) : VecFixed.with(getTypeDefType(sub), length);
  },
  [TypeDefInfo.WrapperKeepOpaque]: (registry, value) => createWithSub(WrapperKeepOpaque, value),
  [TypeDefInfo.WrapperOpaque]: (registry, value) => createWithSub(WrapperOpaque, value)
};
export function constructTypeClass(registry, typeDef) {
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
    throw new Error(`Unable to construct class from ${stringify(typeDef)}: ${error.message}`);
  }
}

// Returns the type Class for construction
export function getTypeClass(registry, typeDef) {
  return registry.getUnsafe(typeDef.type, false, typeDef);
}
export function createClassUnsafe(registry, type) {
  return (
    // just retrieve via name, no creation via typeDef
    registry.getUnsafe(type) ||
    // we don't have an existing type, create the class via typeDef
    getTypeClass(registry, registry.isLookupType(type) ? registry.lookup.getTypeDef(type) : getTypeDef(type))
  );
}
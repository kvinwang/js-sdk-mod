"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.encodeTypeDef = encodeTypeDef;
exports.paramsNotation = paramsNotation;
exports.withTypeString = withTypeString;
var _util = require("@polkadot/util");
var _types = require("../types");
// Copyright 2017-2022 @polkadot/types-create authors & contributors
// SPDX-License-Identifier: Apache-2.0

const stringIdentity = value => value.toString();
const INFO_WRAP = ['BTreeMap', 'BTreeSet', 'Compact', 'HashMap', 'Option', 'Result', 'Vec'];
function paramsNotation(outer, inner) {
  let transform = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : stringIdentity;
  return `${outer}${inner ? `<${(Array.isArray(inner) ? inner : [inner]).map(transform).join(', ')}>` : ''}`;
}
function encodeWithParams(registry, typeDef, outer) {
  const {
    info,
    sub
  } = typeDef;
  switch (info) {
    case _types.TypeDefInfo.BTreeMap:
    case _types.TypeDefInfo.BTreeSet:
    case _types.TypeDefInfo.Compact:
    case _types.TypeDefInfo.HashMap:
    case _types.TypeDefInfo.Linkage:
    case _types.TypeDefInfo.Option:
    case _types.TypeDefInfo.Range:
    case _types.TypeDefInfo.RangeInclusive:
    case _types.TypeDefInfo.Result:
    case _types.TypeDefInfo.Vec:
    case _types.TypeDefInfo.WrapperKeepOpaque:
    case _types.TypeDefInfo.WrapperOpaque:
      return paramsNotation(outer, sub, p => encodeTypeDef(registry, p));
  }
  throw new Error(`Unable to encode ${(0, _util.stringify)(typeDef)} with params`);
}
function encodeSubTypes(registry, sub, asEnum, extra) {
  const names = sub.map(_ref => {
    let {
      name
    } = _ref;
    return name;
  });
  if (!names.every(n => !!n)) {
    throw new Error(`Subtypes does not have consistent names, ${names.join(', ')}`);
  }
  const inner = (0, _util.objectSpread)({}, extra);
  for (let i = 0; i < sub.length; i++) {
    const def = sub[i];
    inner[def.name] = encodeTypeDef(registry, def);
  }
  return (0, _util.stringify)(asEnum ? {
    _enum: inner
  } : inner);
}

// We setup a record here to ensure we have comprehensive coverage (any item not covered will result
// in a compile-time error with the missing index)
const encoders = {
  [_types.TypeDefInfo.BTreeMap]: (registry, typeDef) => encodeWithParams(registry, typeDef, 'BTreeMap'),
  [_types.TypeDefInfo.BTreeSet]: (registry, typeDef) => encodeWithParams(registry, typeDef, 'BTreeSet'),
  [_types.TypeDefInfo.Compact]: (registry, typeDef) => encodeWithParams(registry, typeDef, 'Compact'),
  [_types.TypeDefInfo.DoNotConstruct]: (registry, _ref2) => {
    let {
      displayName,
      lookupIndex,
      lookupName
    } = _ref2;
    return `DoNotConstruct<${lookupName || displayName || ((0, _util.isUndefined)(lookupIndex) ? 'Unknown' : registry.createLookupType(lookupIndex))}>`;
  },
  [_types.TypeDefInfo.Enum]: (registry, _ref3) => {
    let {
      sub
    } = _ref3;
    if (!Array.isArray(sub)) {
      throw new Error('Unable to encode Enum type');
    }

    // c-like enums have all Null entries
    // TODO We need to take the disciminant into account and auto-add empty entries
    return sub.every(_ref4 => {
      let {
        type
      } = _ref4;
      return type === 'Null';
    }) ? (0, _util.stringify)({
      _enum: sub.map((_ref5, index) => {
        let {
          name
        } = _ref5;
        return `${name || `Empty${index}`}`;
      })
    }) : encodeSubTypes(registry, sub, true);
  },
  [_types.TypeDefInfo.HashMap]: (registry, typeDef) => encodeWithParams(registry, typeDef, 'HashMap'),
  [_types.TypeDefInfo.Int]: (registry, _ref6) => {
    let {
      length = 32
    } = _ref6;
    return `Int<${length}>`;
  },
  [_types.TypeDefInfo.Linkage]: (registry, typeDef) => encodeWithParams(registry, typeDef, 'Linkage'),
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  [_types.TypeDefInfo.Null]: (registry, typeDef) => 'Null',
  [_types.TypeDefInfo.Option]: (registry, typeDef) => encodeWithParams(registry, typeDef, 'Option'),
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  [_types.TypeDefInfo.Plain]: (registry, _ref7) => {
    let {
      displayName,
      type
    } = _ref7;
    return displayName || type;
  },
  [_types.TypeDefInfo.Range]: (registry, typeDef) => encodeWithParams(registry, typeDef, 'Range'),
  [_types.TypeDefInfo.RangeInclusive]: (registry, typeDef) => encodeWithParams(registry, typeDef, 'RangeInclusive'),
  [_types.TypeDefInfo.Result]: (registry, typeDef) => encodeWithParams(registry, typeDef, 'Result'),
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  [_types.TypeDefInfo.Set]: (registry, _ref8) => {
    let {
      length = 8,
      sub
    } = _ref8;
    if (!Array.isArray(sub)) {
      throw new Error('Unable to encode Set type');
    }
    return (0, _util.stringify)({
      _set: sub.reduce((all, _ref9, count) => {
        let {
          index,
          name
        } = _ref9;
        return (0, _util.objectSpread)(all, {
          [`${name || `Unknown${index || count}`}`]: index || count
        });
      }, {
        _bitLength: length || 8
      })
    });
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  [_types.TypeDefInfo.Si]: (registry, _ref10) => {
    let {
      lookupName,
      type
    } = _ref10;
    return lookupName || type;
  },
  [_types.TypeDefInfo.Struct]: (registry, _ref11) => {
    let {
      alias,
      sub
    } = _ref11;
    if (!Array.isArray(sub)) {
      throw new Error('Unable to encode Struct type');
    }
    return encodeSubTypes(registry, sub, false, alias ? {
      _alias: [...alias.entries()].reduce((all, _ref12) => {
        let [k, v] = _ref12;
        return (0, _util.objectSpread)(all, {
          [k]: v
        });
      }, {})
    } : {});
  },
  [_types.TypeDefInfo.Tuple]: (registry, _ref13) => {
    let {
      sub
    } = _ref13;
    if (!Array.isArray(sub)) {
      throw new Error('Unable to encode Tuple type');
    }
    return `(${sub.map(type => encodeTypeDef(registry, type)).join(',')})`;
  },
  [_types.TypeDefInfo.UInt]: (registry, _ref14) => {
    let {
      length = 32
    } = _ref14;
    return `UInt<${length}>`;
  },
  [_types.TypeDefInfo.Vec]: (registry, typeDef) => encodeWithParams(registry, typeDef, 'Vec'),
  [_types.TypeDefInfo.VecFixed]: (registry, _ref15) => {
    let {
      length,
      sub
    } = _ref15;
    if (!(0, _util.isNumber)(length) || !sub || Array.isArray(sub)) {
      throw new Error('Unable to encode VecFixed type');
    }
    return `[${sub.type};${length}]`;
  },
  [_types.TypeDefInfo.WrapperKeepOpaque]: (registry, typeDef) => encodeWithParams(registry, typeDef, 'WrapperKeepOpaque'),
  [_types.TypeDefInfo.WrapperOpaque]: (registry, typeDef) => encodeWithParams(registry, typeDef, 'WrapperOpaque')
};
function encodeType(registry, typeDef) {
  let withLookup = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  return withLookup && typeDef.lookupName ? typeDef.lookupName : encoders[typeDef.info](registry, typeDef);
}
function encodeTypeDef(registry, typeDef) {
  // In the case of contracts we do have the unfortunate situation where the displayName would
  // refer to "Option" when it is an option. For these, string it out, only using when actually
  // not a top-level element to be used
  return typeDef.displayName && !INFO_WRAP.some(i => typeDef.displayName === i) ? typeDef.displayName : encodeType(registry, typeDef);
}
function withTypeString(registry, typeDef) {
  return (0, _util.objectSpread)({}, typeDef, {
    type: encodeType(registry, typeDef, false)
  });
}
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NO_RAW_ARGS = void 0;
exports.createFunction = createFunction;
exports.createKeyInspect = createKeyInspect;
exports.createKeyRaw = createKeyRaw;
exports.createKeyRawParts = createKeyRawParts;
var _typesCodec = require("@polkadot/types-codec");
var _util = require("@polkadot/util");
var _utilCrypto = require("@polkadot/util-crypto");
var _util2 = require("../../util");
var _getHasher = require("./getHasher");
// Copyright 2017-2022 @polkadot/types authors & contributors
// SPDX-License-Identifier: Apache-2.0

const NO_RAW_ARGS = {
  args: [],
  hashers: [],
  keys: []
};

/** @internal */
exports.NO_RAW_ARGS = NO_RAW_ARGS;
function filterDefined(a) {
  return !(0, _util.isUndefined)(a);
}

/** @internal */
function assertArgs(_ref, _ref2) {
  let {
    method,
    section
  } = _ref;
  let {
    args,
    keys
  } = _ref2;
  if (!Array.isArray(args)) {
    throw new Error(`Call to ${(0, _util.stringCamelCase)(section || 'unknown')}.${(0, _util.stringCamelCase)(method || 'unknown')} needs ${keys.length} arguments`);
  } else if (args.filter(filterDefined).length !== keys.length) {
    throw new Error(`Call to ${(0, _util.stringCamelCase)(section || 'unknown')}.${(0, _util.stringCamelCase)(method || 'unknown')} needs ${keys.length} arguments, found [${args.join(', ')}]`);
  }
}

/** @internal */
function createKeyRawParts(registry, itemFn, _ref3) {
  let {
    args,
    hashers,
    keys
  } = _ref3;
  const extra = new Array(keys.length);
  for (let i = 0; i < keys.length; i++) {
    extra[i] = (0, _getHasher.getHasher)(hashers[i])(registry.createTypeUnsafe(registry.createLookupType(keys[i]), [args[i]]).toU8a());
  }
  return [[(0, _utilCrypto.xxhashAsU8a)(itemFn.prefix, 128), (0, _utilCrypto.xxhashAsU8a)(itemFn.method, 128)], extra];
}

/** @internal */
function createKeyInspect(registry, itemFn, args) {
  assertArgs(itemFn, args);
  const {
    meta
  } = itemFn;
  const [prefix, extra] = createKeyRawParts(registry, itemFn, args);
  let types = [];
  if (meta.type.isMap) {
    const {
      hashers,
      key
    } = meta.type.asMap;
    types = hashers.length === 1 ? [`${hashers[0].type}(${(0, _util2.getSiName)(registry.lookup, key)})`] : registry.lookup.getSiType(key).def.asTuple.map((k, i) => `${hashers[i].type}(${(0, _util2.getSiName)(registry.lookup, k)})`);
  }
  const names = ['module', 'method'].concat(...args.args.map((_, i) => types[i]));
  return {
    inner: prefix.concat(...extra).map((v, i) => ({
      name: names[i],
      outer: [v]
    }))
  };
}

/** @internal */
function createKeyRaw(registry, itemFn, args) {
  const [prefix, extra] = createKeyRawParts(registry, itemFn, args);
  return (0, _util.u8aConcat)(...prefix, ...extra);
}

/** @internal */
function createKey(registry, itemFn, args) {
  assertArgs(itemFn, args);

  // always add the length prefix (underlying it is Bytes)
  return (0, _util.compactAddLength)(createKeyRaw(registry, itemFn, args));
}

/** @internal */
function createStorageInspect(registry, itemFn, options) {
  const {
    meta: {
      type
    }
  } = itemFn;
  return function () {
    if (type.isPlain) {
      return options.skipHashing ? {
        inner: [],
        name: 'wellKnown',
        outer: [(0, _util.u8aToU8a)(options.key)]
      } : createKeyInspect(registry, itemFn, NO_RAW_ARGS);
    }
    const {
      hashers,
      key
    } = type.asMap;
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    return hashers.length === 1 ? createKeyInspect(registry, itemFn, {
      args,
      hashers,
      keys: [key]
    }) : createKeyInspect(registry, itemFn, {
      args,
      hashers,
      keys: registry.lookup.getSiType(key).def.asTuple
    });
  };
}

/** @internal */
function createStorageFn(registry, itemFn, options) {
  const {
    meta: {
      type
    }
  } = itemFn;
  let cacheKey = null;

  // Can only have zero or one argument:
  //   - storage.system.account(address)
  //   - storage.timestamp.blockPeriod()
  // For higher-map queries the params are passed in as an tuple, [key1, key2]
  return function () {
    if (type.isPlain) {
      if (!cacheKey) {
        cacheKey = options.skipHashing ? (0, _util.compactAddLength)((0, _util.u8aToU8a)(options.key)) : createKey(registry, itemFn, NO_RAW_ARGS);
      }
      return cacheKey;
    }
    const {
      hashers,
      key
    } = type.asMap;
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }
    return hashers.length === 1 ? createKey(registry, itemFn, {
      args,
      hashers,
      keys: [key]
    }) : createKey(registry, itemFn, {
      args,
      hashers,
      keys: registry.lookup.getSiType(key).def.asTuple
    });
  };
}

/** @internal */
function createWithMeta(registry, itemFn, options) {
  const {
    meta,
    method,
    prefix,
    section
  } = itemFn;
  const storageFn = createStorageFn(registry, itemFn, options);
  storageFn.inspect = createStorageInspect(registry, itemFn, options);
  storageFn.meta = meta;
  storageFn.method = (0, _util.stringCamelCase)(method);
  storageFn.prefix = prefix;
  storageFn.section = section;

  // explicitly add the actual method in the toJSON, this gets used to determine caching and without it
  // instances (e.g. collective) will not work since it is only matched on param meta
  storageFn.toJSON = () => (0, _util.objectSpread)({
    storage: {
      method,
      prefix,
      section
    }
  }, meta.toJSON());
  return storageFn;
}

/** @internal */
function extendHeadMeta(registry, _ref4, _ref5, iterFn) {
  let {
    meta: {
      docs,
      name,
      type
    },
    section
  } = _ref4;
  let {
    method
  } = _ref5;
  // metadata with a fallback value using the type of the key, the normal
  // meta fallback only applies to actual entry values, create one for head
  const meta = registry.createTypeUnsafe('StorageEntryMetadataLatest', [{
    docs,
    fallback: registry.createTypeUnsafe('Bytes', []),
    modifier: registry.createTypeUnsafe('StorageEntryModifierLatest', [1]),
    // required
    name,
    type: registry.createTypeUnsafe('StorageEntryTypeLatest', [type.asMap.key, 0])
  }]);
  iterFn.meta = meta;
  const fn = function () {
    return registry.createTypeUnsafe('StorageKey', [iterFn(...arguments), {
      method,
      section
    }]);
  };
  fn.meta = meta;
  return fn;
}

/** @internal */
function extendPrefixedMap(registry, itemFn, storageFn) {
  const {
    meta: {
      type
    },
    method,
    section
  } = itemFn;
  storageFn.iterKey = extendHeadMeta(registry, itemFn, storageFn, function () {
    for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }
    if (args.length && (type.isPlain || args.length >= type.asMap.hashers.length)) {
      throw new Error(`Iteration of ${(0, _util.stringCamelCase)(section || 'unknown')}.${(0, _util.stringCamelCase)(method || 'unknown')} needs arguments to be at least one less than the full arguments, found [${args.join(', ')}]`);
    }
    if (args.length) {
      if (type.isMap) {
        const {
          hashers,
          key
        } = type.asMap;
        const keysVec = hashers.length === 1 ? [key] : registry.lookup.getSiType(key).def.asTuple;
        return new _typesCodec.Raw(registry, createKeyRaw(registry, itemFn, {
          args,
          hashers: hashers.slice(0, args.length),
          keys: keysVec.slice(0, args.length)
        }));
      }
    }
    return new _typesCodec.Raw(registry, createKeyRaw(registry, itemFn, NO_RAW_ARGS));
  });
  return storageFn;
}

/** @internal */
function createFunction(registry, itemFn, options) {
  const {
    meta: {
      type
    }
  } = itemFn;
  const storageFn = createWithMeta(registry, itemFn, options);
  if (type.isMap) {
    extendPrefixedMap(registry, itemFn, storageFn);
  }
  storageFn.keyPrefix = function () {
    return storageFn.iterKey && storageFn.iterKey(...arguments) || (0, _util.compactStripLength)(storageFn())[1];
  };
  return storageFn;
}
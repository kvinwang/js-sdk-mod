"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StorageKey = void 0;
exports.unwrapStorageSi = unwrapStorageSi;
exports.unwrapStorageType = unwrapStorageType;
var _typesCodec = require("@polkadot/types-codec");
var _util = require("@polkadot/util");
var _util2 = require("../metadata/util");
// Copyright 2017-2022 @polkadot/types authors & contributors
// SPDX-License-Identifier: Apache-2.0

// hasher type -> [initialHashLength, canDecodeKey]
const HASHER_MAP = {
  // opaque
  Blake2_128: [16, false],
  // eslint-disable-line camelcase
  Blake2_128Concat: [16, true],
  // eslint-disable-line camelcase
  Blake2_256: [32, false],
  // eslint-disable-line camelcase
  Identity: [0, true],
  Twox128: [16, false],
  Twox256: [32, false],
  Twox64Concat: [8, true]
};
function unwrapStorageSi(type) {
  return type.isPlain ? type.asPlain : type.asMap.value;
}

/** @internal */
function unwrapStorageType(registry, type, isOptional) {
  const outputType = (0, _util2.getSiName)(registry.lookup, unwrapStorageSi(type));
  return isOptional ? `Option<${outputType}>` : outputType;
}

/** @internal */
function decodeStorageKey(value) {
  if ((0, _util.isU8a)(value) || !value || (0, _util.isString)(value)) {
    // let Bytes handle these inputs
    return {
      key: value
    };
  } else if (value instanceof StorageKey) {
    return {
      key: value,
      method: value.method,
      section: value.section
    };
  } else if ((0, _util.isFunction)(value)) {
    return {
      key: value(),
      method: value.method,
      section: value.section
    };
  } else if (Array.isArray(value)) {
    const [fn, args = []] = value;
    if (!(0, _util.isFunction)(fn)) {
      throw new Error('Expected function input for key construction');
    }
    if (fn.meta && fn.meta.type.isMap) {
      const map = fn.meta.type.asMap;
      if (!Array.isArray(args) || args.length !== map.hashers.length) {
        throw new Error(`Expected an array of ${map.hashers.length} values as params to a Map query`);
      }
    }
    return {
      key: fn(...args),
      method: fn.method,
      section: fn.section
    };
  }
  throw new Error(`Unable to convert input ${value} to StorageKey`);
}

/** @internal */
function decodeHashers(registry, value, hashers) {
  // the storage entry is xxhashAsU8a(prefix, 128) + xxhashAsU8a(method, 128), 256 bits total
  let offset = 32;
  const result = new Array(hashers.length);
  for (let i = 0; i < hashers.length; i++) {
    const [hasher, type] = hashers[i];
    const [hashLen, canDecode] = HASHER_MAP[hasher.type];
    const decoded = canDecode ? registry.createTypeUnsafe((0, _util2.getSiName)(registry.lookup, type), [value.subarray(offset + hashLen)]) : registry.createTypeUnsafe('Raw', [value.subarray(offset, offset + hashLen)]);
    offset += hashLen + (canDecode ? decoded.encodedLength : 0);
    result[i] = decoded;
  }
  return result;
}

/** @internal */
function decodeArgsFromMeta(registry, value, meta) {
  if (!meta || !meta.type.isMap) {
    return [];
  }
  const {
    hashers,
    key
  } = meta.type.asMap;
  const keys = hashers.length === 1 ? [key] : registry.lookup.getSiType(key).def.asTuple;
  return decodeHashers(registry, value, hashers.map((h, i) => [h, keys[i]]));
}

/** @internal */
function getMeta(value) {
  if (value instanceof StorageKey) {
    return value.meta;
  } else if ((0, _util.isFunction)(value)) {
    return value.meta;
  } else if (Array.isArray(value)) {
    const [fn] = value;
    return fn.meta;
  }
  return undefined;
}

/** @internal */
function getType(registry, value) {
  if (value instanceof StorageKey) {
    return value.outputType;
  } else if ((0, _util.isFunction)(value)) {
    return unwrapStorageType(registry, value.meta.type);
  } else if (Array.isArray(value)) {
    const [fn] = value;
    if (fn.meta) {
      return unwrapStorageType(registry, fn.meta.type);
    }
  }

  // If we have no type set, default to Raw
  return 'Raw';
}

/**
 * @name StorageKey
 * @description
 * A representation of a storage key (typically hashed) in the system. It can be
 * constructed by passing in a raw key or a StorageEntry with (optional) arguments.
 */
class StorageKey extends _typesCodec.Bytes {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore This is assigned via this.decodeArgsFromMeta()
  #args;
  #meta;
  #outputType;
  #method;
  #section;
  constructor(registry, value) {
    let override = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    const {
      key,
      method,
      section
    } = decodeStorageKey(value);
    super(registry, key);
    this.#outputType = getType(registry, value);

    // decode the args (as applicable based on the key and the hashers, after all init)
    this.setMeta(getMeta(value), override.section || section, override.method || method);
  }

  /**
   * @description Return the decoded arguments (applicable to map with decodable values)
   */
  get args() {
    return this.#args;
  }

  /**
   * @description The metadata or `undefined` when not available
   */
  get meta() {
    return this.#meta;
  }

  /**
   * @description The key method or `undefined` when not specified
   */
  get method() {
    return this.#method;
  }

  /**
   * @description The output type
   */
  get outputType() {
    return this.#outputType;
  }

  /**
   * @description The key section or `undefined` when not specified
   */
  get section() {
    return this.#section;
  }
  is(key) {
    return key.section === this.section && key.method === this.method;
  }

  /**
   * @description Sets the meta for this key
   */
  setMeta(meta, section, method) {
    this.#meta = meta;
    this.#method = method || this.#method;
    this.#section = section || this.#section;
    if (meta) {
      this.#outputType = unwrapStorageType(this.registry, meta.type);
    }
    try {
      this.#args = decodeArgsFromMeta(this.registry, this.toU8a(true), meta);
    } catch (error) {
      // ignore...
    }
    return this;
  }

  /**
   * @description Returns the Human representation for this type
   */
  toHuman() {
    return this.#args.length ? this.#args.map(a => a.toHuman()) : super.toHuman();
  }

  /**
   * @description Returns the raw type for this
   */
  toRawType() {
    return 'StorageKey';
  }
}
exports.StorageKey = StorageKey;
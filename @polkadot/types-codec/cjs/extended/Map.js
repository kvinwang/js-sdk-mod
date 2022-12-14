"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CodecMap = void 0;
var _util = require("@polkadot/util");
var _Array = require("../abstract/Array");
var _Enum = require("../base/Enum");
var _Raw = require("../native/Raw");
var _Struct = require("../native/Struct");
var _utils = require("../utils");
// Copyright 2017-2022 @polkadot/types-codec authors & contributors
// SPDX-License-Identifier: Apache-2.0

const l = (0, _util.logger)('Map');

/** @internal */
function decodeMapFromU8a(registry, KeyClass, ValClass, u8a) {
  const output = new Map();
  const [offset, count] = (0, _util.compactFromU8aLim)(u8a);
  const types = [];
  for (let i = 0; i < count; i++) {
    types.push(KeyClass, ValClass);
  }
  const [values, decodedLength] = (0, _utils.decodeU8a)(registry, new Array(types.length), u8a.subarray(offset), [types, []]);
  for (let i = 0; i < values.length; i += 2) {
    output.set(values[i], values[i + 1]);
  }
  return [KeyClass, ValClass, output, offset + decodedLength];
}

/** @internal */
function decodeMapFromMap(registry, KeyClass, ValClass, value) {
  const output = new Map();
  for (const [key, val] of value.entries()) {
    const isComplex = KeyClass.prototype instanceof _Array.AbstractArray || KeyClass.prototype instanceof _Struct.Struct || KeyClass.prototype instanceof _Enum.Enum;
    try {
      output.set(key instanceof KeyClass ? key : new KeyClass(registry, isComplex && typeof key === 'string' ? JSON.parse(key) : key), val instanceof ValClass ? val : new ValClass(registry, val));
    } catch (error) {
      l.error('Failed to decode key or value:', error.message);
      throw error;
    }
  }
  return [KeyClass, ValClass, output, 0];
}

/**
 * Decode input to pass into constructor.
 *
 * @param KeyClass - Type of the map key
 * @param ValClass - Type of the map value
 * @param value - Value to decode, one of:
 * - null
 * - undefined
 * - hex
 * - Uint8Array
 * - Map<any, any>, where both key and value types are either
 *   constructors or decodeable values for their types.
 * @param jsonMap
 * @internal
 */
function decodeMap(registry, keyType, valType, value) {
  const KeyClass = (0, _utils.typeToConstructor)(registry, keyType);
  const ValClass = (0, _utils.typeToConstructor)(registry, valType);
  if (!value) {
    return [KeyClass, ValClass, new Map(), 0];
  } else if ((0, _util.isU8a)(value) || (0, _util.isHex)(value)) {
    return decodeMapFromU8a(registry, KeyClass, ValClass, (0, _util.u8aToU8a)(value));
  } else if (value instanceof Map) {
    return decodeMapFromMap(registry, KeyClass, ValClass, value);
  } else if ((0, _util.isObject)(value)) {
    return decodeMapFromMap(registry, KeyClass, ValClass, new Map(Object.entries(value)));
  }
  throw new Error('Map: cannot decode type');
}
class CodecMap extends Map {
  #KeyClass;
  #ValClass;
  #type;
  constructor(registry, keyType, valType, rawValue) {
    let type = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 'HashMap';
    const [KeyClass, ValClass, decoded, decodedLength] = decodeMap(registry, keyType, valType, rawValue);
    super(type === 'BTreeMap' ? (0, _utils.sortMap)(decoded) : decoded);
    this.registry = registry;
    this.initialU8aLength = decodedLength;
    this.#KeyClass = KeyClass;
    this.#ValClass = ValClass;
    this.#type = type;
  }

  /**
   * @description The length of the value when encoded as a Uint8Array
   */
  get encodedLength() {
    let len = (0, _util.compactToU8a)(this.size).length;
    for (const [k, v] of this.entries()) {
      len += k.encodedLength + v.encodedLength;
    }
    return len;
  }

  /**
   * @description Returns a hash of the value
   */
  get hash() {
    return this.registry.hash(this.toU8a());
  }

  /**
   * @description Checks if the value is an empty value
   */
  get isEmpty() {
    return this.size === 0;
  }

  /**
   * @description Compares the value of the input to see if there is a match
   */
  eq(other) {
    return (0, _utils.compareMap)(this, other);
  }

  /**
   * @description Returns a breakdown of the hex encoding for this Codec
   */
  inspect() {
    const inner = new Array();
    for (const [k, v] of this.entries()) {
      inner.push(k.inspect());
      inner.push(v.inspect());
    }
    return {
      inner,
      outer: [(0, _util.compactToU8a)(this.size)]
    };
  }

  /**
   * @description Returns a hex string representation of the value. isLe returns a LE (number-only) representation
   */
  toHex() {
    return (0, _util.u8aToHex)(this.toU8a());
  }

  /**
   * @description Converts the Object to to a human-friendly JSON, with additional fields, expansion and formatting of information
   */
  toHuman(isExtended) {
    const json = {};
    for (const [k, v] of this.entries()) {
      json[k instanceof _Raw.Raw && k.isAscii ? k.toUtf8() : k.toString()] = v.toHuman(isExtended);
    }
    return json;
  }

  /**
   * @description Converts the Object to JSON, typically used for RPC transfers
   */
  toJSON() {
    const json = {};
    for (const [k, v] of this.entries()) {
      json[k.toString()] = v.toJSON();
    }
    return json;
  }

  /**
   * @description Converts the value in a best-fit primitive form
   */
  toPrimitive() {
    const json = {};
    for (const [k, v] of this.entries()) {
      json[k instanceof _Raw.Raw && k.isAscii ? k.toUtf8() : k.toString()] = v.toPrimitive();
    }
    return json;
  }

  /**
   * @description Returns the base runtime type name for this instance
   */
  toRawType() {
    return `${this.#type}<${this.registry.getClassName(this.#KeyClass) || new this.#KeyClass(this.registry).toRawType()},${this.registry.getClassName(this.#ValClass) || new this.#ValClass(this.registry).toRawType()}>`;
  }

  /**
   * @description Returns the string representation of the value
   */
  toString() {
    return (0, _util.stringify)(this.toJSON());
  }

  /**
   * @description Encodes the value as a Uint8Array as per the SCALE specifications
   * @param isBare true when the value has none of the type-specific prefixes (internal)
   */
  toU8a(isBare) {
    const encoded = new Array();
    if (!isBare) {
      encoded.push((0, _util.compactToU8a)(this.size));
    }
    for (const [k, v] of this.entries()) {
      encoded.push(k.toU8a(isBare), v.toU8a(isBare));
    }
    return (0, _util.u8aConcatStrict)(encoded);
  }
}
exports.CodecMap = CodecMap;
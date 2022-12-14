// Copyright 2017-2022 @polkadot/types-codec authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { compactFromU8aLim, compactToU8a, isHex, isObject, isU8a, logger, stringify, u8aConcatStrict, u8aToHex, u8aToU8a } from '@polkadot/util';
import { AbstractArray } from "../abstract/Array.js";
import { Enum } from "../base/Enum.js";
import { Raw } from "../native/Raw.js";
import { Struct } from "../native/Struct.js";
import { compareMap, decodeU8a, sortMap, typeToConstructor } from "../utils/index.js";
const l = logger('Map');

/** @internal */
function decodeMapFromU8a(registry, KeyClass, ValClass, u8a) {
  const output = new Map();
  const [offset, count] = compactFromU8aLim(u8a);
  const types = [];
  for (let i = 0; i < count; i++) {
    types.push(KeyClass, ValClass);
  }
  const [values, decodedLength] = decodeU8a(registry, new Array(types.length), u8a.subarray(offset), [types, []]);
  for (let i = 0; i < values.length; i += 2) {
    output.set(values[i], values[i + 1]);
  }
  return [KeyClass, ValClass, output, offset + decodedLength];
}

/** @internal */
function decodeMapFromMap(registry, KeyClass, ValClass, value) {
  const output = new Map();
  for (const [key, val] of value.entries()) {
    const isComplex = KeyClass.prototype instanceof AbstractArray || KeyClass.prototype instanceof Struct || KeyClass.prototype instanceof Enum;
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
  const KeyClass = typeToConstructor(registry, keyType);
  const ValClass = typeToConstructor(registry, valType);
  if (!value) {
    return [KeyClass, ValClass, new Map(), 0];
  } else if (isU8a(value) || isHex(value)) {
    return decodeMapFromU8a(registry, KeyClass, ValClass, u8aToU8a(value));
  } else if (value instanceof Map) {
    return decodeMapFromMap(registry, KeyClass, ValClass, value);
  } else if (isObject(value)) {
    return decodeMapFromMap(registry, KeyClass, ValClass, new Map(Object.entries(value)));
  }
  throw new Error('Map: cannot decode type');
}
export class CodecMap extends Map {
  #KeyClass;
  #ValClass;
  #type;
  constructor(registry, keyType, valType, rawValue, type = 'HashMap') {
    const [KeyClass, ValClass, decoded, decodedLength] = decodeMap(registry, keyType, valType, rawValue);
    super(type === 'BTreeMap' ? sortMap(decoded) : decoded);
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
    let len = compactToU8a(this.size).length;
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
    return compareMap(this, other);
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
      outer: [compactToU8a(this.size)]
    };
  }

  /**
   * @description Returns a hex string representation of the value. isLe returns a LE (number-only) representation
   */
  toHex() {
    return u8aToHex(this.toU8a());
  }

  /**
   * @description Converts the Object to to a human-friendly JSON, with additional fields, expansion and formatting of information
   */
  toHuman(isExtended) {
    const json = {};
    for (const [k, v] of this.entries()) {
      json[k instanceof Raw && k.isAscii ? k.toUtf8() : k.toString()] = v.toHuman(isExtended);
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
      json[k instanceof Raw && k.isAscii ? k.toUtf8() : k.toString()] = v.toPrimitive();
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
    return stringify(this.toJSON());
  }

  /**
   * @description Encodes the value as a Uint8Array as per the SCALE specifications
   * @param isBare true when the value has none of the type-specific prefixes (internal)
   */
  toU8a(isBare) {
    const encoded = new Array();
    if (!isBare) {
      encoded.push(compactToU8a(this.size));
    }
    for (const [k, v] of this.entries()) {
      encoded.push(k.toU8a(isBare), v.toU8a(isBare));
    }
    return u8aConcatStrict(encoded);
  }
}
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BTreeSet = void 0;
var _util = require("@polkadot/util");
var _utils = require("../utils");
// Copyright 2017-2022 @polkadot/types-codec authors & contributors
// SPDX-License-Identifier: Apache-2.0

const l = (0, _util.logger)('BTreeSet');

/** @internal */
function decodeSetFromU8a(registry, ValClass, u8a) {
  const output = new Set();
  const [offset, count] = (0, _util.compactFromU8aLim)(u8a);
  const result = new Array(count);
  const [decodedLength] = (0, _utils.decodeU8aVec)(registry, result, u8a, offset, ValClass);
  for (let i = 0; i < count; i++) {
    output.add(result[i]);
  }
  return [ValClass, output, decodedLength];
}

/** @internal */
function decodeSetFromSet(registry, ValClass, value) {
  const output = new Set();
  value.forEach(val => {
    try {
      output.add(val instanceof ValClass ? val : new ValClass(registry, val));
    } catch (error) {
      l.error('Failed to decode key or value:', error.message);
      throw error;
    }
  });
  return [ValClass, output, 0];
}

/**
 * Decode input to pass into constructor.
 *
 * @param ValClass - Type of the map value
 * @param value - Value to decode, one of:
 * - null
 * - undefined
 * - hex
 * - Uint8Array
 * - Set<any>, where both key and value types are either
 *   constructors or decodeable values for their types.
 * @param jsonSet
 * @internal
 */
function decodeSet(registry, valType, value) {
  const ValClass = (0, _utils.typeToConstructor)(registry, valType);
  if (!value) {
    return [ValClass, new Set(), 0];
  } else if ((0, _util.isU8a)(value) || (0, _util.isHex)(value)) {
    return decodeSetFromU8a(registry, ValClass, (0, _util.u8aToU8a)(value));
  } else if (Array.isArray(value) || value instanceof Set) {
    return decodeSetFromSet(registry, ValClass, value);
  }
  throw new Error('BTreeSet: cannot decode type');
}
class BTreeSet extends Set {
  #ValClass;
  constructor(registry, valType, rawValue) {
    const [ValClass, values, decodedLength] = decodeSet(registry, valType, rawValue);
    super((0, _utils.sortSet)(values));
    this.registry = registry;
    this.initialU8aLength = decodedLength;
    this.#ValClass = ValClass;
  }
  static with(valType) {
    return class extends BTreeSet {
      constructor(registry, value) {
        super(registry, valType, value);
      }
    };
  }

  /**
   * @description The length of the value when encoded as a Uint8Array
   */
  get encodedLength() {
    let len = (0, _util.compactToU8a)(this.size).length;
    for (const v of this.values()) {
      len += v.encodedLength;
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
   * @description The actual set values as a string[]
   */
  get strings() {
    return [...super.values()].map(v => v.toString());
  }

  /**
   * @description Compares the value of the input to see if there is a match
   */
  eq(other) {
    return (0, _utils.compareSet)(this, other);
  }

  /**
   * @description Returns a breakdown of the hex encoding for this Codec
   */
  inspect() {
    const inner = new Array();
    for (const v of this.values()) {
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
    const json = [];
    for (const v of this.values()) {
      json.push(v.toHuman(isExtended));
    }
    return json;
  }

  /**
   * @description Converts the Object to JSON, typically used for RPC transfers
   */
  toJSON() {
    const json = [];
    for (const v of this.values()) {
      json.push(v.toJSON());
    }
    return json;
  }

  /**
   * @description Returns the base runtime type name for this instance
   */
  toRawType() {
    return `BTreeSet<${this.registry.getClassName(this.#ValClass) || new this.#ValClass(this.registry).toRawType()}>`;
  }

  /**
   * @description Converts the value in a best-fit primitive form
   */
  toPrimitive() {
    const json = [];
    for (const v of this.values()) {
      json.push(v.toPrimitive());
    }
    return json;
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
    for (const v of this.values()) {
      encoded.push(v.toU8a(isBare));
    }
    return (0, _util.u8aConcatStrict)(encoded);
  }
}
exports.BTreeSet = BTreeSet;
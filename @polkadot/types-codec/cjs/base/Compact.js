"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Compact = void 0;
var _util = require("@polkadot/util");
var _utils = require("../utils");
// Copyright 2017-2022 @polkadot/types-codec authors & contributors
// SPDX-License-Identifier: Apache-2.0

function noopSetDefinition(d) {
  return d;
}
function decodeCompact(registry, Type, value) {
  if ((0, _util.isU8a)(value)) {
    const [decodedLength, bn] = (value[0] & 0b11) < 0b11 ? (0, _util.compactFromU8aLim)(value) : (0, _util.compactFromU8a)(value);
    return [new Type(registry, bn), decodedLength];
  } else if (value instanceof Compact) {
    const raw = value.unwrap();
    return raw instanceof Type ? [raw, 0] : [new Type(registry, raw), 0];
  } else if (value instanceof Type) {
    return [value, 0];
  }
  return [new Type(registry, value), 0];
}

/**
 * @name Compact
 * @description
 * A compact length-encoding codec wrapper. It performs the same function as Length, however
 * differs in that it uses a variable number of bytes to do the actual encoding. This is mostly
 * used by other types to add length-prefixed encoding, or in the case of wrapped types, taking
 * a number and making the compact representation thereof
 */
class Compact {
  #Type;
  #raw;
  constructor(registry, Type) {
    let value = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    let {
      definition,
      setDefinition = noopSetDefinition
    } = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    this.registry = registry;
    this.#Type = definition || setDefinition((0, _utils.typeToConstructor)(registry, Type));
    const [raw, decodedLength] = decodeCompact(registry, this.#Type, value);
    this.initialU8aLength = decodedLength;
    this.#raw = raw;
  }
  static with(Type) {
    let definition;

    // eslint-disable-next-line no-return-assign
    const setDefinition = d => definition = d;
    return class extends Compact {
      constructor(registry, value) {
        super(registry, Type, value, {
          definition,
          setDefinition
        });
      }
    };
  }

  /**
   * @description The length of the value when encoded as a Uint8Array
   */
  get encodedLength() {
    return this.toU8a().length;
  }

  /**
   * @description returns a hash of the contents
   */
  get hash() {
    return this.registry.hash(this.toU8a());
  }

  /**
   * @description Checks if the value is an empty value
   */
  get isEmpty() {
    return this.#raw.isEmpty;
  }

  /**
   * @description Returns the number of bits in the value
   */
  bitLength() {
    return this.#raw.bitLength();
  }

  /**
   * @description Compares the value of the input to see if there is a match
   */
  eq(other) {
    return this.#raw.eq(other instanceof Compact ? other.#raw : other);
  }

  /**
   * @description Returns a breakdown of the hex encoding for this Codec
   */
  inspect() {
    return {
      outer: [this.toU8a()]
    };
  }

  /**
   * @description Returns a BigInt representation of the number
   */
  toBigInt() {
    return this.#raw.toBigInt();
  }

  /**
   * @description Returns the BN representation of the number
   */
  toBn() {
    return this.#raw.toBn();
  }

  /**
   * @description Returns a hex string representation of the value. isLe returns a LE (number-only) representation
   */
  toHex(isLe) {
    return this.#raw.toHex(isLe);
  }

  /**
   * @description Converts the Object to to a human-friendly JSON, with additional fields, expansion and formatting of information
   */
  toHuman(isExtended) {
    return this.#raw.toHuman(isExtended);
  }

  /**
   * @description Converts the Object to JSON, typically used for RPC transfers
   */
  toJSON() {
    return this.#raw.toJSON();
  }

  /**
   * @description Returns the number representation for the value
   */
  toNumber() {
    return this.#raw.toNumber();
  }

  /**
   * @description Converts the value in a best-fit primitive form
   */
  toPrimitive() {
    return this.#raw.toPrimitive();
  }

  /**
   * @description Returns the base runtime type name for this instance
   */
  toRawType() {
    return `Compact<${this.registry.getClassName(this.#Type) || this.#raw.toRawType()}>`;
  }

  /**
   * @description Returns the string representation of the value
   */
  toString() {
    return this.#raw.toString();
  }

  /**
   * @description Encodes the value as a Uint8Array as per the SCALE specifications
   * @param isBare true when the value has none of the type-specific prefixes (internal)
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  toU8a(isBare) {
    return (0, _util.compactToU8a)(this.#raw.toBn());
  }

  /**
   * @description Returns the embedded [[UInt]] or [[Moment]] value
   */
  unwrap() {
    return this.#raw;
  }
}
exports.Compact = Compact;
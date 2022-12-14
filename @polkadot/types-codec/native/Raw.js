// Copyright 2017-2022 @polkadot/types-codec authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { isAscii, isUndefined, isUtf8, u8aToHex, u8aToString, u8aToU8a } from '@polkadot/util';

/**
 * @name Raw
 * @description
 * A basic wrapper around Uint8Array, with no frills and no fuss. It does differ
 * from other implementations where it will consume the full Uint8Array as passed to it.
 * As such it is meant to be subclassed where the wrapper takes care of the
 * actual lengths instead of used directly.
 * @noInheritDoc
 */
export class Raw extends Uint8Array {
  /**
   * @description This ensures that operators such as clice, filter, map, etc. return
   * new Array instances (without this we need to apply overrides)
   */
  static get [Symbol.species]() {
    return Uint8Array;
  }
  constructor(registry, value, initialU8aLength) {
    super(u8aToU8a(value));
    this.registry = registry;
    this.initialU8aLength = initialU8aLength;
  }

  /**
   * @description The length of the value when encoded as a Uint8Array
   */
  get encodedLength() {
    return this.length;
  }

  /**
   * @description returns a hash of the contents
   */
  get hash() {
    return this.registry.hash(this.toU8a());
  }

  /**
   * @description Returns true if the wrapped value contains only ASCII printable characters
   */
  get isAscii() {
    return isAscii(this);
  }

  /**
   * @description Returns true if the type wraps an empty/default all-0 value
   */
  get isEmpty() {
    return !this.length || isUndefined(this.find(b => !!b));
  }

  /**
   * @description Returns true if the wrapped value contains only utf8 characters
   */
  get isUtf8() {
    return isUtf8(this);
  }

  /**
   * @description Returns the number of bits in the value
   */
  bitLength() {
    return this.length * 8;
  }

  /**
   * @description Compares the value of the input to see if there is a match
   */
  eq(other) {
    if (other instanceof Uint8Array) {
      return this.length === other.length && !this.some((b, index) => b !== other[index]);
    }
    return this.eq(u8aToU8a(other));
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
   * @description Returns a hex string representation of the value
   */
  toHex() {
    return u8aToHex(this);
  }

  /**
   * @description Converts the Object to to a human-friendly JSON, with additional fields, expansion and formatting of information
   */
  toHuman() {
    return this.toPrimitive();
  }

  /**
   * @description Converts the Object to JSON, typically used for RPC transfers
   */
  toJSON() {
    return this.toHex();
  }

  /**
   * @description Converts the value in a best-fit primitive form
   */
  toPrimitive() {
    if (this.isAscii) {
      const text = this.toUtf8();

      // ensure we didn't end up with multibyte codepoints
      if (isAscii(text)) {
        return text;
      }
    }
    return this.toJSON();
  }

  /**
   * @description Returns the base runtime type name for this instance
   */
  toRawType() {
    return 'Raw';
  }

  /**
   * @description Returns the string representation of the value
   */
  toString() {
    return this.toHex();
  }

  /**
   * @description Encodes the value as a Uint8Array as per the SCALE specifications
   * @param isBare true when the value has none of the type-specific prefixes (internal)
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  toU8a(isBare) {
    return Uint8Array.from(this);
  }

  /**
   * @description Returns the wrapped data as a UTF-8 string
   */
  toUtf8() {
    if (!this.isUtf8) {
      throw new Error('The character sequence is not a valid Utf8 string');
    }
    return u8aToString(this);
  }
}
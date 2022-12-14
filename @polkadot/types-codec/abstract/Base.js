// Copyright 2017-2022 @polkadot/types-codec authors & contributors
// SPDX-License-Identifier: Apache-2.0

/**
 * @name Base
 * @description A type extends the Base class, when it holds a value
 */
export class AbstractBase {
  #raw;
  constructor(registry, value, initialU8aLength) {
    this.#raw = value;
    this.initialU8aLength = initialU8aLength;
    this.registry = registry;
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
  get inner() {
    return this.#raw;
  }

  /**
   * @description Checks if the value is an empty value
   */
  get isEmpty() {
    return this.#raw.isEmpty;
  }

  /**
   * @description Compares the value of the input to see if there is a match
   */
  eq(other) {
    return this.#raw.eq(other);
  }

  /**
   * @description Returns a breakdown of the hex encoding for this Codec
   */
  inspect() {
    return this.#raw.inspect();
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
   * @description Converts the value in a best-fit primitive form
   */
  toPrimitive() {
    return this.#raw.toPrimitive();
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
  toU8a(isBare) {
    return this.#raw.toU8a(isBare);
  }

  /**
   * @description Returns the base runtime type name for this instance
   */
  toRawType() {
    return 'Base';
  }
  unwrap() {
    return this.#raw;
  }
}
// Copyright 2017-2022 @polkadot/types-codec authors & contributors
// SPDX-License-Identifier: Apache-2.0

/**
 * @name DoNotConstruct
 * @description
 * An unknown type that fails on construction with the type info
 */
export class DoNotConstruct {
  #neverError;
  constructor(registry, typeName = 'DoNotConstruct') {
    this.registry = registry;
    this.#neverError = new Error(`DoNotConstruct: Cannot construct unknown type ${typeName}`);
    throw this.#neverError;
  }
  static with(typeName) {
    return class extends DoNotConstruct {
      constructor(registry) {
        super(registry, typeName);
      }
    };
  }

  /**
   * @description The length of the value when encoded as a Uint8Array
   */
  get encodedLength() {
    throw this.#neverError;
  }

  /**
   * @description returns a hash of the contents
   */
  get hash() {
    throw this.#neverError;
  }

  /**
   * @description Checks if the value is an empty value (always true)
   */
  get isEmpty() {
    throw this.#neverError;
  }
  eq() {
    throw this.#neverError;
  }
  inspect() {
    throw this.#neverError;
  }
  toHex() {
    throw this.#neverError;
  }
  toHuman() {
    throw this.#neverError;
  }
  toJSON() {
    throw this.#neverError;
  }
  toPrimitive() {
    throw this.#neverError;
  }
  toRawType() {
    throw this.#neverError;
  }
  toString() {
    throw this.#neverError;
  }
  toU8a() {
    throw this.#neverError;
  }
}
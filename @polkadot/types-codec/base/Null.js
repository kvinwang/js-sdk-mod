// Copyright 2017-2022 @polkadot/types-codec authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { isNull } from '@polkadot/util';

/**
 * @name Null
 * @description
 * Implements a type that does not contain anything (apart from `null`)
 */
export class Null {
  encodedLength = 0;
  isEmpty = true;
  // Added for compatibility reasons, e.g. see Option
  initialU8aLength = 0;
  constructor(registry) {
    this.registry = registry;
  }

  /**
   * @description returns a hash of the contents
   */
  get hash() {
    throw new Error('.hash is not implemented on Null');
  }

  /**
   * @description Compares the value of the input to see if there is a match
   */
  eq(other) {
    return other instanceof Null || isNull(other);
  }

  /**
   * @description Returns a breakdown of the hex encoding for this Codec
   */
  inspect() {
    return {};
  }

  /**
   * @description Returns a hex string representation of the value
   */
  toHex() {
    return '0x';
  }

  /**
   * @description Converts the Object to to a human-friendly JSON, with additional fields, expansion and formatting of information
   */
  toHuman() {
    return this.toJSON();
  }

  /**
   * @description Converts the Object to JSON, typically used for RPC transfers
   */
  toJSON() {
    return null;
  }

  /**
   * @description Converts the value in a best-fit primitive form
   */
  toPrimitive() {
    return null;
  }

  /**
   * @description Returns the base runtime type name for this instance
   */
  toRawType() {
    return 'Null';
  }

  /**
   * @description Returns the string representation of the value
   */
  toString() {
    return '';
  }

  /**
   * @description Encodes the value as a Uint8Array as per the SCALE specifications
   * @param isBare true when the value has none of the type-specific prefixes (internal)
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  toU8a(isBare) {
    return new Uint8Array();
  }
}
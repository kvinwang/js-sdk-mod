// Copyright 2017-2022 @polkadot/types authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { U8aFixed } from '@polkadot/types-codec';
import { hexToU8a, isHex, isString, isU8a, u8aToU8a } from '@polkadot/util';
import { ethereumEncode, isEthereumAddress } from '@polkadot/util-crypto';

/** @internal */
function decodeAccountId(value) {
  if (isU8a(value) || Array.isArray(value)) {
    return u8aToU8a(value);
  } else if (isHex(value) || isEthereumAddress(value.toString())) {
    return hexToU8a(value.toString());
  } else if (isString(value)) {
    return u8aToU8a(value);
  }
  return value;
}

/**
 * @name GenericEthereumAccountId
 * @description
 * A wrapper around an Ethereum-compatible AccountId. Since we are dealing with
 * underlying addresses (20 bytes in length), we extend from U8aFixed which is
 * just a Uint8Array wrapper with a fixed length.
 */
export class GenericEthereumAccountId extends U8aFixed {
  constructor(registry, value = new Uint8Array()) {
    super(registry, decodeAccountId(value), 160);
  }

  /**
   * @description Compares the value of the input to see if there is a match
   */
  eq(other) {
    return super.eq(decodeAccountId(other));
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
    return this.toString();
  }

  /**
   * @description Converts the value in a best-fit primitive form
   */
  toPrimitive() {
    return this.toJSON();
  }

  /**
   * @description Returns the string representation of the value
   */
  toString() {
    return ethereumEncode(this);
  }

  /**
   * @description Returns the base runtime type name for this instance
   */
  toRawType() {
    return 'AccountId';
  }
}
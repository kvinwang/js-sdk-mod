"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GenericAccountIndex = void 0;
var _typesCodec = require("@polkadot/types-codec");
var _util = require("@polkadot/util");
var _utilCrypto = require("@polkadot/util-crypto");
// Copyright 2017-2022 @polkadot/types authors & contributors
// SPDX-License-Identifier: Apache-2.0

const PREFIX_1BYTE = 0xef;
const PREFIX_2BYTE = 0xfc;
const PREFIX_4BYTE = 0xfd;
const PREFIX_8BYTE = 0xfe;
const MAX_1BYTE = new _util.BN(PREFIX_1BYTE);
const MAX_2BYTE = new _util.BN(1).shln(16);
const MAX_4BYTE = new _util.BN(1).shln(32);

/** @internal */
function decodeAccountIndex(value) {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  if (value instanceof GenericAccountIndex) {
    // `value.toBn()` on AccountIndex returns a pure BN (i.e. not an
    // AccountIndex), which has the initial `toString()` implementation.
    return value.toBn();
  } else if ((0, _util.isBn)(value) || (0, _util.isNumber)(value) || (0, _util.isHex)(value) || (0, _util.isU8a)(value) || (0, _util.isBigInt)(value)) {
    return value;
  }
  return decodeAccountIndex((0, _utilCrypto.decodeAddress)(value));
}

/**
 * @name GenericAccountIndex
 * @description
 * A wrapper around an AccountIndex, which is a shortened, variable-length encoding
 * for an Account. We extends from [[U32]] to provide the number-like properties.
 */
class GenericAccountIndex extends _typesCodec.u32 {
  constructor(registry) {
    let value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new _util.BN(0);
    super(registry, decodeAccountIndex(value));
  }
  static calcLength(_value) {
    const value = (0, _util.bnToBn)(_value);
    if (value.lte(MAX_1BYTE)) {
      return 1;
    } else if (value.lt(MAX_2BYTE)) {
      return 2;
    } else if (value.lt(MAX_4BYTE)) {
      return 4;
    }
    return 8;
  }
  static readLength(input) {
    const first = input[0];
    if (first === PREFIX_2BYTE) {
      return [1, 2];
    } else if (first === PREFIX_4BYTE) {
      return [1, 4];
    } else if (first === PREFIX_8BYTE) {
      return [1, 8];
    }
    return [0, 1];
  }
  static writeLength(input) {
    switch (input.length) {
      case 2:
        return new Uint8Array([PREFIX_2BYTE]);
      case 4:
        return new Uint8Array([PREFIX_4BYTE]);
      case 8:
        return new Uint8Array([PREFIX_8BYTE]);
      default:
        return new Uint8Array([]);
    }
  }

  /**
   * @description Compares the value of the input to see if there is a match
   */
  eq(other) {
    // shortcut for BN or Number, don't create an object
    if ((0, _util.isBn)(other) || (0, _util.isNumber)(other)) {
      return super.eq(other);
    }

    // convert and compare
    return super.eq(this.registry.createTypeUnsafe('AccountIndex', [other]));
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
    const length = GenericAccountIndex.calcLength(this);
    return (0, _utilCrypto.encodeAddress)(this.toU8a().subarray(0, length), this.registry.chainSS58);
  }

  /**
   * @description Returns the base runtime type name for this instance
   */
  toRawType() {
    return 'AccountIndex';
  }
}
exports.GenericAccountIndex = GenericAccountIndex;
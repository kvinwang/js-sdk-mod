"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GenericEthereumAccountId = void 0;
var _typesCodec = require("@polkadot/types-codec");
var _util = require("@polkadot/util");
var _utilCrypto = require("@polkadot/util-crypto");
// Copyright 2017-2022 @polkadot/types authors & contributors
// SPDX-License-Identifier: Apache-2.0

/** @internal */
function decodeAccountId(value) {
  if ((0, _util.isU8a)(value) || Array.isArray(value)) {
    return (0, _util.u8aToU8a)(value);
  } else if ((0, _util.isHex)(value) || (0, _utilCrypto.isEthereumAddress)(value.toString())) {
    return (0, _util.hexToU8a)(value.toString());
  } else if ((0, _util.isString)(value)) {
    return (0, _util.u8aToU8a)(value);
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
class GenericEthereumAccountId extends _typesCodec.U8aFixed {
  constructor(registry) {
    let value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Uint8Array();
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
    return (0, _utilCrypto.ethereumEncode)(this);
  }

  /**
   * @description Returns the base runtime type name for this instance
   */
  toRawType() {
    return 'AccountId';
  }
}
exports.GenericEthereumAccountId = GenericEthereumAccountId;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Bytes = void 0;
var _util = require("@polkadot/util");
var _Raw = require("../native/Raw");
// Copyright 2017-2022 @polkadot/types-codec authors & contributors
// SPDX-License-Identifier: Apache-2.0

// Bytes are used for things like on-chain code, so it has a healthy limit
const MAX_LENGTH = 10 * 1024 * 1024;

/** @internal */
function decodeBytesU8a(value) {
  if (!value.length) {
    return [new Uint8Array(), 0];
  }

  // handle all other Uint8Array inputs, these do have a length prefix
  const [offset, length] = (0, _util.compactFromU8aLim)(value);
  const total = offset + length;
  if (length > MAX_LENGTH) {
    throw new Error(`Bytes length ${length.toString()} exceeds ${MAX_LENGTH}`);
  } else if (total > value.length) {
    throw new Error(`Bytes: required length less than remainder, expected at least ${total}, found ${value.length}`);
  }
  return [value.subarray(offset, total), total];
}

/**
 * @name Bytes
 * @description
 * A Bytes wrapper for Vec<u8>. The significant difference between this and a normal Uint8Array
 * is that this version allows for length-encoding. (i.e. it is a variable-item codec, the same
 * as what is found in [[Text]] and [[Vec]])
 */
class Bytes extends _Raw.Raw {
  constructor(registry, value) {
    const [u8a, decodedLength] = (0, _util.isU8a)(value) && !(value instanceof _Raw.Raw) ? decodeBytesU8a(value) : Array.isArray(value) || (0, _util.isString)(value) ? [(0, _util.u8aToU8a)(value), 0] : [value, 0];
    super(registry, u8a, decodedLength);
  }

  /**
   * @description The length of the value when encoded as a Uint8Array
   */
  get encodedLength() {
    return this.length + (0, _util.compactToU8a)(this.length).length;
  }

  /**
   * @description Returns a breakdown of the hex encoding for this Codec
   */
  inspect(isBare) {
    const clength = (0, _util.compactToU8a)(this.length);
    return {
      outer: isBare ? [super.toU8a()] : this.length ? [clength, super.toU8a()] : [clength]
    };
  }

  /**
   * @description Returns the base runtime type name for this instance
   */
  toRawType() {
    return 'Bytes';
  }

  /**
   * @description Encodes the value as a Uint8Array as per the SCALE specifications
   * @param isBare true when the value has none of the type-specific prefixes (internal)
   */
  toU8a(isBare) {
    return isBare ? super.toU8a(isBare) : (0, _util.compactAddLength)(this);
  }
}
exports.Bytes = Bytes;
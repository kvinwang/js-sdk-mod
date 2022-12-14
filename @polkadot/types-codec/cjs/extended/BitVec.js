"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BitVec = void 0;
var _util = require("@polkadot/util");
var _Raw = require("../native/Raw");
// Copyright 2017-2022 @polkadot/types-codec authors & contributors
// SPDX-License-Identifier: Apache-2.0

/** @internal */
function decodeBitVecU8a(value) {
  if (!value || !value.length) {
    return [0, new Uint8Array()];
  }

  // handle all other Uint8Array inputs, these do have a length prefix which is the number of bits encoded
  const [offset, length] = (0, _util.compactFromU8aLim)(value);
  const total = offset + Math.ceil(length / 8);
  if (total > value.length) {
    throw new Error(`BitVec: required length less than remainder, expected at least ${total}, found ${value.length}`);
  }
  return [length, value.subarray(offset, total)];
}

/** @internal */
function decodeBitVec(value) {
  if (Array.isArray(value) || (0, _util.isString)(value)) {
    const u8a = (0, _util.u8aToU8a)(value);
    return [u8a.length / 8, u8a];
  }
  return decodeBitVecU8a(value);
}

/**
 * @name BitVec
 * @description
 * A BitVec that represents an array of bits. The bits are however stored encoded. The difference between this
 * and a normal Bytes would be that the length prefix indicates the number of bits encoded, not the bytes
 */
class BitVec extends _Raw.Raw {
  #decodedLength;
  #isMsb;

  // In lieu of having the Msb/Lsb identifiers passed through, we default to assuming
  // we are dealing with Lsb, which is the default (as of writing) BitVec format used
  // in the Polkadot code (this only affects the toHuman displays)
  constructor(registry, value) {
    let isMsb = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    const [decodedLength, u8a] = decodeBitVec(value);
    super(registry, u8a);
    this.#decodedLength = decodedLength;
    this.#isMsb = isMsb;
  }

  /**
   * @description The length of the value when encoded as a Uint8Array
   */
  get encodedLength() {
    return this.length + (0, _util.compactToU8a)(this.#decodedLength).length;
  }

  /**
   * @description Returns a breakdown of the hex encoding for this Codec
   */
  inspect() {
    return {
      outer: [(0, _util.compactToU8a)(this.#decodedLength), super.toU8a()]
    };
  }
  toHuman() {
    return `0b${[...this.toU8a(true)].map(d => `00000000${d.toString(2)}`.slice(-8)).map(s => this.#isMsb ? s : s.split('').reverse().join('')).join('_')}`;
  }

  /**
   * @description Returns the base runtime type name for this instance
   */
  toRawType() {
    return 'BitVec';
  }

  /**
   * @description Encodes the value as a Uint8Array as per the SCALE specifications
   * @param isBare true when the value has none of the type-specific prefixes (internal)
   */
  toU8a(isBare) {
    const bitVec = super.toU8a();
    return isBare ? bitVec : (0, _util.u8aConcatStrict)([(0, _util.compactToU8a)(this.#decodedLength), bitVec]);
  }
}
exports.BitVec = BitVec;
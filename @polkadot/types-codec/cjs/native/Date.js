"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CodecDate = void 0;
var _util = require("@polkadot/util");
// Copyright 2017-2022 @polkadot/types-codec authors & contributors
// SPDX-License-Identifier: Apache-2.0

const BITLENGTH = 64;
const U8A_OPTS = {
  bitLength: BITLENGTH,
  isLe: true
};
function decodeDate(value) {
  if ((0, _util.isU8a)(value)) {
    value = (0, _util.u8aToBn)(value.subarray(0, BITLENGTH / 8));
  } else if (value instanceof Date) {
    return value;
  } else if ((0, _util.isString)(value)) {
    value = new _util.BN(value.toString(), 10, 'le');
  }
  return new Date((0, _util.bnToBn)(value).toNumber() * 1000);
}

/**
 * @name Date
 * @description
 * A wrapper around seconds/timestamps. Internally the representation only has
 * second precicion (aligning with Rust), so any numbers passed an/out are always
 * per-second. For any encoding/decoding the 1000 multiplier would be applied to
 * get it in line with JavaScript formats. It extends the base JS `Date` object
 * and has all the methods available that are applicable to any `Date`
 * @noInheritDoc
 */
class CodecDate extends Date {
  constructor(registry) {
    let value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    super(decodeDate(value));
    this.registry = registry;
  }

  /**
   * @description The length of the value when encoded as a Uint8Array
   */
  get encodedLength() {
    return BITLENGTH / 8;
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
    return this.getTime() === 0;
  }

  /**
   * @description Returns the number of bits in the value
   */
  bitLength() {
    return BITLENGTH;
  }

  /**
   * @description Compares the value of the input to see if there is a match
   */
  eq(other) {
    return decodeDate(other).getTime() === this.getTime();
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
    return BigInt(this.toNumber());
  }

  /**
   * @description Returns the BN representation of the timestamp
   */
  toBn() {
    return new _util.BN(this.toNumber());
  }

  /**
   * @description Returns a hex string representation of the value
   */
  toHex() {
    let isLe = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    return (0, _util.bnToHex)(this.toBn(), {
      bitLength: BITLENGTH,
      isLe,
      isNegative: false
    });
  }

  /**
   * @description Converts the Object to to a human-friendly JSON, with additional fields, expansion and formatting of information
   */
  toHuman() {
    return this.toISOString();
  }

  /**
   * @description Converts the Object to JSON, typically used for RPC transfers
   */
  toJSON() {
    // FIXME Return type should be number, but conflicts with Date.toJSON()
    // which returns string
    return this.toNumber();
  }

  /**
   * @description Returns the number representation for the timestamp
   */
  toNumber() {
    return Math.ceil(this.getTime() / 1000);
  }

  /**
   * @description Converts the value in a best-fit primitive form
   */
  toPrimitive() {
    return this.toNumber();
  }

  /**
   * @description Returns the base runtime type name for this instance
   */
  toRawType() {
    return 'Moment';
  }

  /**
   * @description Returns the string representation of the value
   */
  toString() {
    // only included here since we do not inherit docs
    return super.toString();
  }

  /**
   * @description Encodes the value as a Uint8Array as per the SCALE specifications
   * @param isBare true when the value has none of the type-specific prefixes (internal)
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  toU8a(isBare) {
    return (0, _util.bnToU8a)(this.toNumber(), U8A_OPTS);
  }
}
exports.CodecDate = CodecDate;
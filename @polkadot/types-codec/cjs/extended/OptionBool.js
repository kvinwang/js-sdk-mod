"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OptionBool = void 0;
var _util = require("@polkadot/util");
var _Option = require("../base/Option");
var _Bool = require("../native/Bool");
// Copyright 2017-2022 @polkadot/types-codec authors & contributors
// SPDX-License-Identifier: Apache-2.0

function decodeU8a(registry, value) {
  // Encoded as -
  //  - 0 = None
  //  - 1 = True
  //  - 2 = False
  return value[0] === 0 ? null : new _Bool.bool(registry, value[0] === 1);
}

/**
 * @name OptionBool
 * @description A specific implementation of Option<bool> than allows for single-byte encoding
 */
class OptionBool extends _Option.Option {
  constructor(registry, value) {
    super(registry, _Bool.bool, (0, _util.isU8a)(value) || (0, _util.isHex)(value) ? decodeU8a(registry, (0, _util.u8aToU8a)(value)) : value);
    this.initialU8aLength = 1;
  }

  /**
   * @description The length of the value when encoded as a Uint8Array
   */
  get encodedLength() {
    return 1;
  }

  /**
   * @description Checks if the value is an empty value (always false)
   */
  get isFalse() {
    return this.isSome ? !this.value.valueOf() : false;
  }

  /**
   * @description Checks if the value is an empty value (always false)
   */
  get isTrue() {
    return this.isSome ? this.value.valueOf() : false;
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
   * @description Returns the base runtime type name for this instance
   */
  toRawType(isBare) {
    return isBare ? 'bool' : 'Option<bool>';
  }

  /**
   * @description Encodes the value as a Uint8Array as per the SCALE specifications
   * @param isBare true when the value has none of the type-specific prefixes (internal)
   */
  toU8a(isBare) {
    if (isBare) {
      return super.toU8a(true);
    }
    return this.isSome ? new Uint8Array([this.isTrue ? 1 : 2]) : new Uint8Array([0]);
  }
}
exports.OptionBool = OptionBool;
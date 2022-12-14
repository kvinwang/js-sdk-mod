"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Int = void 0;
var _Int = require("../abstract/Int");
// Copyright 2017-2022 @polkadot/types-codec authors & contributors
// SPDX-License-Identifier: Apache-2.0

/**
 * @name Int
 * @description
 * A generic signed integer codec. For Substrate all numbers are Little Endian encoded,
 * this handles the encoding and decoding of those numbers. Upon construction
 * the bitLength is provided and any additional use keeps the number to this
 * length. This extends `BN`, so all methods available on a normal `BN` object
 * is available here.
 * @noInheritDoc
 */
class Int extends _Int.AbstractInt {
  constructor(registry) {
    let value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    let bitLength = arguments.length > 2 ? arguments[2] : undefined;
    super(registry, value, bitLength, true);
  }
  static with(bitLength, typeName) {
    return class extends Int {
      constructor(registry, value) {
        super(registry, value, bitLength);
      }
      toRawType() {
        return typeName || super.toRawType();
      }
    };
  }
}
exports.Int = Int;
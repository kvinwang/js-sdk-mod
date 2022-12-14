"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VecFixed = void 0;
var _util = require("@polkadot/util");
var _Array = require("../abstract/Array");
var _utils = require("../utils");
var _Vec = require("./Vec");
// Copyright 2017-2022 @polkadot/types-codec authors & contributors
// SPDX-License-Identifier: Apache-2.0

function noopSetDefinition(d) {
  return d;
}

/**
 * @name VecFixed
 * @description
 * This manages codec arrays of a fixed length
 */
class VecFixed extends _Array.AbstractArray {
  #Type;
  constructor(registry, Type, length) {
    let value = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
    let {
      definition,
      setDefinition = noopSetDefinition
    } = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
    super(registry, length);
    this.#Type = definition || setDefinition((0, _utils.typeToConstructor)(registry, Type));
    this.initialU8aLength = ((0, _util.isU8a)(value) ? (0, _utils.decodeU8aVec)(registry, this, value, 0, this.#Type) : (0, _Vec.decodeVec)(registry, this, value, 0, this.#Type))[1];
  }
  static with(Type, length) {
    let definition;

    // eslint-disable-next-line no-return-assign
    const setDefinition = d => definition = d;
    return class extends VecFixed {
      constructor(registry, value) {
        super(registry, Type, length, value, {
          definition,
          setDefinition
        });
      }
    };
  }

  /**
   * @description The type for the items
   */
  get Type() {
    return new this.#Type(this.registry).toRawType();
  }

  /**
   * @description The length of the value when encoded as a Uint8Array
   */
  get encodedLength() {
    let total = 0;
    for (let i = 0; i < this.length; i++) {
      total += this[i].encodedLength;
    }
    return total;
  }

  /**
   * @description Returns a breakdown of the hex encoding for this Codec
   */
  inspect() {
    return {
      inner: this.inspectInner()
    };
  }
  toU8a() {
    // we override, we don't add the length prefix for ourselves, and at the same time we
    // ignore isBare on entries, since they should be properly encoded at all times
    const encoded = this.toU8aInner();
    return encoded.length ? (0, _util.u8aConcatStrict)(encoded) : new Uint8Array([]);
  }

  /**
   * @description Returns the base runtime type name for this instance
   */
  toRawType() {
    return `[${this.Type};${this.length}]`;
  }
}
exports.VecFixed = VecFixed;
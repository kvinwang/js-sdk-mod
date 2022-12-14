"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Tuple = void 0;
var _util = require("@polkadot/util");
var _Array = require("../abstract/Array");
var _utils = require("../utils");
// Copyright 2017-2022 @polkadot/types-codec authors & contributors
// SPDX-License-Identifier: Apache-2.0

function noopSetDefinition(d) {
  return d;
}

/** @internal */
function decodeTuple(registry, result, value, Classes) {
  if ((0, _util.isU8a)(value) || (0, _util.isHex)(value)) {
    return (0, _utils.decodeU8a)(registry, result, (0, _util.u8aToU8a)(value), Classes);
  }
  const Types = Classes[0];
  for (let i = 0; i < Types.length; i++) {
    try {
      const entry = value == null ? void 0 : value[i];
      result[i] = entry instanceof Types[i] ? entry : new Types[i](registry, entry);
    } catch (error) {
      throw new Error(`Tuple: failed on ${i}:: ${error.message}`);
    }
  }
  return [result, 0];
}

/**
 * @name Tuple
 * @description
 * A Tuple defines an anonymous fixed-length array, where each element has its
 * own type. It extends the base JS `Array` object.
 */
class Tuple extends _Array.AbstractArray {
  #Types;
  constructor(registry, Types, value) {
    let {
      definition,
      setDefinition = noopSetDefinition
    } = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    const Classes = definition || setDefinition(Array.isArray(Types) ? [Types.map(t => (0, _utils.typeToConstructor)(registry, t)), []] : (0, _util.isFunction)(Types) || (0, _util.isString)(Types) ? [[(0, _utils.typeToConstructor)(registry, Types)], []] : (0, _utils.mapToTypeMap)(registry, Types));
    super(registry, Classes[0].length);
    this.initialU8aLength = ((0, _util.isU8a)(value) ? (0, _utils.decodeU8a)(registry, this, value, Classes) : decodeTuple(registry, this, value, Classes))[1];
    this.#Types = Classes;
  }
  static with(Types) {
    let definition;

    // eslint-disable-next-line no-return-assign
    const setDefinition = d => definition = d;
    return class extends Tuple {
      constructor(registry, value) {
        super(registry, Types, value, {
          definition,
          setDefinition
        });
      }
    };
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
   * @description The types definition of the tuple
   */
  get Types() {
    return this.#Types[1].length ? this.#Types[1] : this.#Types[0].map(T => new T(this.registry).toRawType());
  }

  /**
   * @description Returns a breakdown of the hex encoding for this Codec
   */
  inspect() {
    return {
      inner: this.inspectInner()
    };
  }

  /**
   * @description Returns the base runtime type name for this instance
   */
  toRawType() {
    const types = this.#Types[0].map(T => this.registry.getClassName(T) || new T(this.registry).toRawType());
    return `(${types.join(',')})`;
  }

  /**
   * @description Returns the string representation of the value
   */
  toString() {
    // Overwrite the default toString representation of Array.
    return (0, _util.stringify)(this.toJSON());
  }

  /**
   * @description Encodes the value as a Uint8Array as per the SCALE specifications
   * @param isBare true when the value has none of the type-specific prefixes (internal)
   */
  toU8a(isBare) {
    return (0, _util.u8aConcatStrict)(this.toU8aInner(isBare));
  }
}
exports.Tuple = Tuple;
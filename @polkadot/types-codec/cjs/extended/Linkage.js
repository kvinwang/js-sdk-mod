"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LinkageResult = exports.Linkage = void 0;
var _Option = require("../base/Option");
var _Tuple = require("../base/Tuple");
var _Vec = require("../base/Vec");
var _Struct = require("../native/Struct");
// Copyright 2017-2022 @polkadot/types-codec authors & contributors
// SPDX-License-Identifier: Apache-2.0

const EMPTY = new Uint8Array();

/**
 * @name Linkage
 * @description The wrapper for the result from a LinkedMap
 */
class Linkage extends _Struct.Struct {
  constructor(registry, Type, value) {
    super(registry, {
      previous: _Option.Option.with(Type),
      // eslint-disable-next-line sort-keys
      next: _Option.Option.with(Type)
    }, value);
  }
  static withKey(Type) {
    return class extends Linkage {
      constructor(registry, value) {
        super(registry, Type, value);
      }
    };
  }
  get previous() {
    return this.get('previous');
  }
  get next() {
    return this.get('next');
  }

  /**
   * @description Returns the base runtime type name for this instance
   */
  toRawType() {
    return `Linkage<${this.next.toRawType(true)}>`;
  }

  /**
   * @description Custom toU8a which with bare mode does not return the linkage if empty
   */
  toU8a() {
    // As part of a storage query (where these appear), in the case of empty, the values
    // are NOT populated by the node - follow the same logic, leaving it empty
    return this.isEmpty ? EMPTY : super.toU8a();
  }
}

/**
 * @name LinkageResult
 * @description A Linkage keys/Values tuple
 */
exports.Linkage = Linkage;
class LinkageResult extends _Tuple.Tuple {
  constructor(registry, _ref, _ref2) {
    let [TypeKey, keys] = _ref;
    let [TypeValue, values] = _ref2;
    super(registry, {
      Keys: _Vec.Vec.with(TypeKey),
      Values: _Vec.Vec.with(TypeValue)
    }, [keys, values]);
  }
}
exports.LinkageResult = LinkageResult;
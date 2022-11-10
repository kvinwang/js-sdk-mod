"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VecAny = void 0;
var _Array = require("../abstract/Array");
// Copyright 2017-2022 @polkadot/types-codec authors & contributors
// SPDX-License-Identifier: Apache-2.0

/**
 * @name VecAny
 * @description
 * This manages codec arrays, assuming that the inputs are already of type Codec. Unlike
 * a vector, this can be used to manage array-like structures with variable arguments of
 * any types
 */
class VecAny extends _Array.AbstractArray {
  /**
   * @description Returns the base runtime type name for this instance
   */
  toRawType() {
    // FIXME This is basically an any type, cannot instantiate via createType
    return 'Vec<Codec>';
  }
}
exports.VecAny = VecAny;
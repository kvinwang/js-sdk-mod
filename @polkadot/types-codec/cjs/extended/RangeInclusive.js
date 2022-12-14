"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RangeInclusive = void 0;
var _Range = require("./Range");
// Copyright 2017-2022 @polkadot/types-codec authors & contributors
// SPDX-License-Identifier: Apache-2.0

class RangeInclusive extends _Range.Range {
  constructor(registry, Type, value) {
    super(registry, Type, value, {
      rangeName: 'RangeInclusive'
    });
  }
  static with(Type) {
    return class extends RangeInclusive {
      constructor(registry, value) {
        super(registry, Type, value);
      }
    };
  }
}
exports.RangeInclusive = RangeInclusive;
// Copyright 2017-2022 @polkadot/types-codec authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Range } from "./Range.js";
export class RangeInclusive extends Range {
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
// Copyright 2017-2022 @polkadot/types-codec authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { WrapperKeepOpaque } from "./WrapperKeepOpaque.js";
export class WrapperOpaque extends WrapperKeepOpaque {
  constructor(registry, typeName, value) {
    super(registry, typeName, value, {
      opaqueName: 'WrapperOpaque'
    });
  }
  static with(Type) {
    return class extends WrapperOpaque {
      constructor(registry, value) {
        super(registry, Type, value);
      }
    };
  }

  /**
   * @description The inner value for this wrapper, in all cases it _should_ be decodable (unlike KeepOpaque)
   */
  get inner() {
    return this.unwrap();
  }
}
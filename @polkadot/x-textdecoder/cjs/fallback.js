"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TextDecoder = void 0;
// Copyright 2017-2022 @polkadot/x-textencoder authors & contributors
// SPDX-License-Identifier: Apache-2.0

// This is very limited, only handling Ascii values
class TextDecoder {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars,no-useless-constructor
  constructor(_) {
    // nothing
  }
  decode(value) {
    let result = '';
    for (let i = 0; i < value.length; i++) {
      result += String.fromCharCode(value[i]);
    }
    return result;
  }
}
exports.TextDecoder = TextDecoder;
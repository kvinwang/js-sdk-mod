"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mapToTypeMap = mapToTypeMap;
var _typeToConstructor = require("./typeToConstructor");
// Copyright 2017-2022 @polkadot/types-codec authors & contributors
// SPDX-License-Identifier: Apache-2.0

/**
 * @description takes an input map of the form `{ [string]: string | CodecClass }` and returns a map of `{ [string]: CodecClass }`
 */
function mapToTypeMap(registry, input) {
  const entries = Object.entries(input);
  const count = entries.length;
  const output = [new Array(count), new Array(count)];
  for (let i = 0; i < count; i++) {
    output[1][i] = entries[i][0];
    output[0][i] = (0, _typeToConstructor.typeToConstructor)(registry, entries[i][1]);
  }
  return output;
}
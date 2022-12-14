"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getStorage = getStorage;
var _substrate = require("./substrate");
// Copyright 2017-2022 @polkadot/types authors & contributors
// SPDX-License-Identifier: Apache-2.0

/** @internal */
function getStorage(registry) {
  const storage = {};
  const entries = Object.entries(_substrate.substrate);
  for (let e = 0; e < entries.length; e++) {
    storage[entries[e][0]] = entries[e][1](registry);
  }
  return {
    substrate: storage
  };
}
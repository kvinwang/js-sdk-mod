"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createTestPairs = createTestPairs;
var _nobody = require("./pair/nobody");
var _testing = require("./testing");
// Copyright 2017-2022 @polkadot/keyring authors & contributors
// SPDX-License-Identifier: Apache-2.0

function createTestPairs(options) {
  let isDerived = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  const keyring = (0, _testing.createTestKeyring)(options, isDerived);
  const pairs = keyring.getPairs();
  const map = {
    nobody: (0, _nobody.nobody)()
  };
  for (const p of pairs) {
    map[p.meta.name] = p;
  }
  return map;
}
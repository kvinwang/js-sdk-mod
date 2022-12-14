"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.knownTestnet = void 0;
// Copyright 2017-2022 @polkadot/networks authors & contributors
// SPDX-License-Identifier: Apache-2.0

// testnets should not allow selection
const knownTestnet = {
  '': true,
  // this is the default non-network entry
  'cess-testnet': true,
  'dock-testnet': true,
  jupiter: true,
  'mathchain-testnet': true,
  p3dt: true,
  subspace_testnet: true,
  'zero-alphaville': true
};
exports.knownTestnet = knownTestnet;
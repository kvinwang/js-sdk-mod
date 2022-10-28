"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.runtime = void 0;
// Copyright 2017-2022 @polkadot/types authors & contributors
// SPDX-License-Identifier: Apache-2.0
// implemented by chains bridging into the relay, not the relay itself
const finalityV1 = {
  methods: {
    best_finalized: {
      description: 'Returns number and hash of the best finalized header known to the bridge module.',
      params: [],
      type: '(BlockNumber, Hash)'
    }
  },
  version: 1
};
const runtime = {
  KusamaFinalityApi: [finalityV1],
  PolkadotFinalityApi: [finalityV1],
  RococoFinalityApi: [finalityV1],
  WestendFinalityApi: [finalityV1]
};
exports.runtime = runtime;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rpc = void 0;
// Copyright 2017-2022 @polkadot/types authors & contributors
// SPDX-License-Identifier: Apache-2.0

const rpc = {
  proveFinality: {
    description: 'Prove finality for the given block number, returning the Justification for the last block in the set.',
    params: [{
      name: 'blockNumber',
      type: 'BlockNumber'
    }],
    type: 'Option<EncodedFinalityProofs>'
  },
  roundState: {
    description: 'Returns the state of the current best round state as well as the ongoing background rounds',
    params: [],
    type: 'ReportedRoundStates'
  },
  subscribeJustifications: {
    description: 'Subscribes to grandpa justifications',
    params: [],
    pubsub: ['justifications', 'subscribeJustifications', 'unsubscribeJustifications'],
    type: 'JustificationNotification'
  }
};
exports.rpc = rpc;
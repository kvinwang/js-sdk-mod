"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rpc = void 0;
// Copyright 2017-2022 @polkadot/types authors & contributors
// SPDX-License-Identifier: Apache-2.0
const rpc = {
  getBlock: {
    description: 'Get header and body of a relay chain block',
    params: [{
      isHistoric: true,
      isOptional: true,
      name: 'hash',
      type: 'BlockHash'
    }],
    type: 'SignedBlock'
  },
  getBlockHash: {
    description: 'Get the block hash for a specific block',
    params: [{
      isOptional: true,
      name: 'blockNumber',
      type: 'BlockNumber'
    }],
    type: 'BlockHash'
  },
  getFinalizedHead: {
    alias: ['chain_getFinalisedHead'],
    description: 'Get hash of the last finalized block in the canon chain',
    params: [],
    type: 'BlockHash'
  },
  getHeader: {
    alias: ['chain_getHead'],
    description: 'Retrieves the header for a specific block',
    params: [{
      isHistoric: true,
      isOptional: true,
      name: 'hash',
      type: 'BlockHash'
    }],
    type: 'Header'
  },
  subscribeAllHeads: {
    description: 'Retrieves the newest header via subscription',
    params: [],
    pubsub: ['allHead', 'subscribeAllHeads', 'unsubscribeAllHeads'],
    type: 'Header'
  },
  subscribeFinalizedHeads: {
    alias: ['chain_subscribeFinalisedHeads', 'chain_unsubscribeFinalisedHeads'],
    description: 'Retrieves the best finalized header via subscription',
    params: [],
    pubsub: ['finalizedHead', 'subscribeFinalizedHeads', 'unsubscribeFinalizedHeads'],
    type: 'Header'
  },
  subscribeNewHeads: {
    alias: ['chain_unsubscribeNewHeads', 'subscribe_newHead', 'unsubscribe_newHead'],
    description: 'Retrieves the best header via subscription',
    params: [],
    // NOTE These still has the aliassed version, compatible with 1.x
    pubsub: ['newHead', 'subscribeNewHead', 'unsubscribeNewHead'],
    type: 'Header'
  }
};
exports.rpc = rpc;
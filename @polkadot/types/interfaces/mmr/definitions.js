// Copyright 2017-2022 @polkadot/types authors & contributors
// SPDX-License-Identifier: Apache-2.0
// order important in structs... :)

/* eslint-disable sort-keys */
import { rpc } from "./rpc.js";
import { runtime } from "./runtime.js";
export default {
  rpc,
  runtime,
  types: {
    MmrBatchProof: {
      leafIndices: 'Vec<MmrLeafIndex>',
      leafCount: 'MmrNodeIndex',
      items: 'Vec<Hash>'
    },
    MmrEncodableOpaqueLeaf: 'Bytes',
    MmrError: {
      _enum: ['Push', 'GetRoot', 'Commit', 'GenerateProof', 'Verify', 'LeafNotFound', ' PalletNotIncluded', 'InvalidLeafIndex']
    },
    MmrLeafBatchProof: {
      blockHash: 'BlockHash',
      leaves: 'Bytes',
      proof: 'Bytes'
    },
    MmrLeafIndex: 'u64',
    MmrLeafProof: {
      blockHash: 'BlockHash',
      leaf: 'Bytes',
      proof: 'Bytes'
    },
    MmrNodeIndex: 'u64',
    MmrProof: {
      leafIndex: 'MmrLeafIndex',
      leafCount: 'MmrNodeIndex',
      items: 'Vec<Hash>'
    }
  }
};
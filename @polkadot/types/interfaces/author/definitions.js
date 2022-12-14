// Copyright 2017-2022 @polkadot/types authors & contributors
// SPDX-License-Identifier: Apache-2.0

// order important in structs... :)
/* eslint-disable sort-keys */

import { rpc } from "./rpc.js";
export default {
  rpc,
  types: {
    ExtrinsicOrHash: {
      _enum: {
        Hash: 'Hash',
        Extrinsic: 'Bytes'
      }
    },
    ExtrinsicStatus: {
      _enum: {
        Future: 'Null',
        Ready: 'Null',
        Broadcast: 'Vec<Text>',
        InBlock: 'Hash',
        Retracted: 'Hash',
        FinalityTimeout: 'Hash',
        Finalized: 'Hash',
        Usurped: 'Hash',
        Dropped: 'Null',
        Invalid: 'Null'
      }
    }
  }
};
// Copyright 2017-2022 @polkadot/types authors & contributors
// SPDX-License-Identifier: Apache-2.0

// order important in structs... :)
/* eslint-disable sort-keys */

import { rpc } from "./rpc.js";
export default {
  rpc,
  types: {
    BlockStats: {
      witnessLen: 'u64',
      witnessCompactLen: 'u64',
      blockLen: 'u64',
      blockNumExtrinsics: 'u64'
    }
  }
};
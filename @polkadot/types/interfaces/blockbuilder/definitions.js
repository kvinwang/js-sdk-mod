// Copyright 2017-2022 @polkadot/types authors & contributors
// SPDX-License-Identifier: Apache-2.0

// order important in structs... :)
/* eslint-disable sort-keys */

import { runtime } from "./runtime.js";
export default {
  rpc: {},
  runtime,
  types: {
    CheckInherentsResult: {
      okay: 'bool',
      fatalError: 'bool',
      errors: 'InherentData'
    },
    InherentData: {
      data: 'BTreeMap<InherentIdentifier, Bytes>'
    },
    InherentIdentifier: '[u8; 8]'
  }
};
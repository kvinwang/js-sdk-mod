// Copyright 2017-2022 @polkadot/types authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { objectSpread } from '@polkadot/util';
const BB_V2_TO_V4 = {
  // this was removed after V4
  random_seed: {
    description: 'Generate a random seed.',
    params: [],
    type: 'Hash'
  }
};
const BB_V2_TO_V5 = {
  apply_extrinsic: {
    description: 'Apply the given extrinsic.',
    params: [{
      name: 'extrinsic',
      type: 'Extrinsic'
    }],
    type: 'ApplyExtrinsicResultPre6'
  }
};
const BB_V2_TO_V6 = {
  check_inherents: {
    description: 'Check that the inherents are valid.',
    params: [{
      name: 'block',
      type: 'Block'
    }, {
      name: 'data',
      type: 'InherentData'
    }],
    type: 'CheckInherentsResult'
  },
  inherent_extrinsics: {
    description: 'Generate inherent extrinsics.',
    params: [{
      name: 'inherent',
      type: 'InherentData'
    }],
    type: 'Vec<Extrinsic>'
  }
};
const BB_V3_TO_V6 = {
  // renamed in v3 from finalize_block
  finalize_block: {
    description: 'Finish the current block.',
    params: [],
    type: 'Header'
  }
};
export const runtime = {
  BlockBuilder: [{
    methods: objectSpread({
      apply_extrinsic: {
        description: 'Apply the given extrinsic.',
        params: [{
          name: 'extrinsic',
          type: 'Extrinsic'
        }],
        type: 'ApplyExtrinsicResult'
      }
    }, BB_V2_TO_V6, BB_V3_TO_V6),
    version: 6
  }, {
    methods: objectSpread({
      // apply_extrinsic result changed in 6
    }, BB_V2_TO_V5, BB_V2_TO_V6, BB_V3_TO_V6),
    version: 5
  }, {
    methods: objectSpread({
      // random_seed removed
    }, BB_V2_TO_V4, BB_V2_TO_V5, BB_V2_TO_V6, BB_V3_TO_V6),
    version: 4
  }, {
    methods: objectSpread({
      // finalize_block renamed
    }, BB_V2_TO_V4, BB_V2_TO_V6, BB_V3_TO_V6),
    version: 3
  }, {
    methods: objectSpread({
      finalise_block: {
        description: 'Finish the current block.',
        params: [],
        type: 'Header'
      }
    }, BB_V2_TO_V4, BB_V2_TO_V6),
    version: 2
  }]
};
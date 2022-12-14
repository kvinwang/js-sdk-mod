// Copyright 2017-2022 @polkadot/types authors & contributors
// SPDX-License-Identifier: Apache-2.0

export const runtime = {
  CollectCollationInfo: [{
    methods: {
      collect_collation_info: {
        description: 'Collect information about a collation.',
        params: [{
          name: 'header',
          type: 'Header'
        }],
        type: 'CollationInfo'
      }
    },
    version: 2
  }, {
    methods: {
      collect_collation_info: {
        description: 'Collect information about a collation.',
        params: [],
        type: 'CollationInfoV1'
      }
    },
    version: 1
  }]
};
// Copyright 2017-2022 @polkadot/types authors & contributors
// SPDX-License-Identifier: Apache-2.0

export const runtime = {
  DifficultyApi: [{
    methods: {
      difficulty: {
        description: 'Return the target difficulty of the next block.',
        params: [],
        // This is Difficulty in the original, however this is chain-specific
        type: 'Raw'
      }
    },
    version: 1
  }],
  TimestampApi: [{
    methods: {
      timestamp: {
        description: 'API necessary for timestamp-based difficulty adjustment algorithms.',
        params: [],
        type: 'Moment'
      }
    },
    version: 1
  }]
};
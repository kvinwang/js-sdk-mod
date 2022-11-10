// Copyright 2017-2022 @polkadot/types authors & contributors
// SPDX-License-Identifier: Apache-2.0

export const runtime = {
  Benchmark: [{
    methods: {
      benchmark_metadata: {
        description: 'Get the benchmark metadata available for this runtime.',
        params: [{
          name: 'extra',
          type: 'bool'
        }],
        type: '(Vec<BenchmarkList>, Vec<StorageInfo>)'
      },
      dispatch_benchmark: {
        description: 'Dispatch the given benchmark.',
        params: [{
          name: 'config',
          type: 'BenchmarkConfig'
        }],
        type: 'Result<Vec<BenchmarkBatch>, Text>'
      }
    },
    version: 1
  }]
};
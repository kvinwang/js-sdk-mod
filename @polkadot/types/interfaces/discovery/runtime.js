// Copyright 2017-2022 @polkadot/types authors & contributors
// SPDX-License-Identifier: Apache-2.0

export const runtime = {
  AuthorityDiscoveryApi: [{
    methods: {
      authorities: {
        description: 'Retrieve authority identifiers of the current and next authority set.',
        params: [],
        type: 'Vec<AuthorityId>'
      }
    },
    version: 1
  }]
};
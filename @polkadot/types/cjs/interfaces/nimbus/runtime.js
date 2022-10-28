"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.runtime = void 0;
// Copyright 2017-2022 @polkadot/types authors & contributors
// SPDX-License-Identifier: Apache-2.0
const runtime = {
  // deprecated, the NimbusApi is current - this is for backwards compat
  AuthorFilterAPI: [{
    methods: {
      can_author: {
        description: 'The runtime api used to predict whether an author will be eligible in the given slot',
        params: [{
          name: 'author',
          type: 'AccountId'
        }, {
          name: 'relayParent',
          type: 'u32'
        }, {
          name: 'parentHeader',
          type: 'Header'
        }],
        type: 'bool'
      }
    },
    version: 2
  }, {
    methods: {
      can_author: {
        description: 'The runtime api used to predict whether an author will be eligible in the given slot',
        params: [{
          name: 'author',
          type: 'AccountId'
        }, {
          name: 'relayParent',
          type: 'u32'
        }],
        type: 'bool'
      }
    },
    version: 1
  }],
  NimbusApi: [{
    methods: {
      can_author: {
        description: 'The runtime api used to predict whether a Nimbus author will be eligible in the given slot',
        params: [{
          name: 'author',
          type: 'AccountId'
        }, {
          name: 'relayParent',
          type: 'u32'
        }, {
          name: 'parentHeader',
          type: 'Header'
        }],
        type: 'bool'
      }
    },
    version: 1
  }]
};
exports.runtime = runtime;
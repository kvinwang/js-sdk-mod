"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.runtime = void 0;
// Copyright 2017-2022 @polkadot/types authors & contributors
// SPDX-License-Identifier: Apache-2.0

const runtime = {
  AuraApi: [{
    methods: {
      authorities: {
        description: 'Return the current set of authorities.',
        params: [],
        type: 'Vec<AuthorityId>'
      },
      slot_duration: {
        description: 'Returns the slot duration for Aura.',
        params: [],
        type: 'SlotDuration'
      }
    },
    version: 1
  }]
};
exports.runtime = runtime;
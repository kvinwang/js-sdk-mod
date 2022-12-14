"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
// Copyright 2017-2022 @polkadot/types authors & contributors
// SPDX-License-Identifier: Apache-2.0
// order important in structs... :)
/* eslint-disable sort-keys */
var _default = {
  rpc: {},
  types: {
    ActiveRecovery: {
      created: 'BlockNumber',
      deposit: 'Balance',
      friends: 'Vec<AccountId>'
    },
    RecoveryConfig: {
      delayPeriod: 'BlockNumber',
      deposit: 'Balance',
      friends: 'Vec<AccountId>',
      threshold: 'u16'
    }
  }
};
exports.default = _default;
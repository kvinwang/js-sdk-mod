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
    ProxyDefinition: {
      delegate: 'AccountId',
      proxyType: 'ProxyType',
      delay: 'BlockNumber'
    },
    ProxyType: {
      _enum: ['Any', 'NonTransfer', 'Governance', 'Staking']
    },
    ProxyAnnouncement: {
      real: 'AccountId',
      callHash: 'Hash',
      height: 'BlockNumber'
    }
  }
};
exports.default = _default;
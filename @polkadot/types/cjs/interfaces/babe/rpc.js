"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rpc = void 0;
// Copyright 2017-2022 @polkadot/types authors & contributors
// SPDX-License-Identifier: Apache-2.0

const rpc = {
  epochAuthorship: {
    description: 'Returns data about which slots (primary or secondary) can be claimed in the current epoch with the keys in the keystore',
    params: [],
    type: 'HashMap<AuthorityId, EpochAuthorship>'
  }
};
exports.rpc = rpc;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _rpc = require("./rpc");
var _runtime = require("./runtime");
// Copyright 2017-2022 @polkadot/types authors & contributors
// SPDX-License-Identifier: Apache-2.0
// order important in structs... :)
/* eslint-disable sort-keys */
var _default = {
  rpc: _rpc.rpc,
  runtime: _runtime.runtime,
  types: {
    BeefyAuthoritySet: {
      id: 'u64',
      len: 'u32',
      root: 'H256'
    },
    BeefyCommitment: {
      payload: 'BeefyPayload',
      blockNumber: 'BlockNumber',
      validatorSetId: 'ValidatorSetId'
    },
    BeefyId: '[u8; 33]',
    BeefySignedCommitment: {
      commitment: 'BeefyCommitment',
      signatures: 'Vec<Option<EcdsaSignature>>'
    },
    BeefyNextAuthoritySet: {
      id: 'u64',
      len: 'u32',
      root: 'H256'
    },
    BeefyPayload: 'Vec<(BeefyPayloadId, Bytes)>',
    BeefyPayloadId: '[u8;2]',
    MmrRootHash: 'H256',
    ValidatorSetId: 'u64',
    ValidatorSet: {
      validators: 'Vec<AuthorityId>',
      id: 'ValidatorSetId'
    }
  }
};
exports.default = _default;
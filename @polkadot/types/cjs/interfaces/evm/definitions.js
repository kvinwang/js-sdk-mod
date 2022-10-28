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
    EvmAccount: {
      nonce: 'u256',
      balance: 'u256'
    },
    EvmCallInfo: {
      exitReason: 'ExitReason',
      value: 'Bytes',
      usedGas: 'U256',
      logs: 'Vec<EvmLog>'
    },
    EvmCreateInfo: {
      exitReason: 'ExitReason',
      value: 'H160',
      usedGas: 'U256',
      logs: 'Vec<EvmLog>'
    },
    EvmLog: {
      address: 'H160',
      topics: 'Vec<H256>',
      data: 'Bytes'
    },
    EvmVicinity: {
      gasPrice: 'u256',
      origin: 'H160'
    },
    ExitError: {
      _enum: {
        StackUnderflow: 'Null',
        StackOverflow: 'Null',
        InvalidJump: 'Null',
        InvalidRange: 'Null',
        DesignatedInvalid: 'Null',
        CallTooDeep: 'Null',
        CreateCollision: 'Null',
        CreateContractLimit: 'Null',
        OutOfOffset: 'Null',
        OutOfGas: 'Null',
        OutOfFund: 'Null',
        PCUnderflow: 'Null',
        CreateEmpty: 'Null',
        Other: 'Text'
      }
    },
    ExitFatal: {
      _enum: {
        NotSupported: 'Null',
        UnhandledInterrupt: 'Null',
        CallErrorAsFatal: 'ExitError',
        Other: 'Text'
      }
    },
    ExitReason: {
      _enum: {
        Succeed: 'ExitSucceed',
        Error: 'ExitError',
        Revert: 'ExitRevert',
        Fatal: 'ExitFatal'
      }
    },
    ExitRevert: {
      _enum: ['Reverted']
    },
    ExitSucceed: {
      _enum: ['Stopped', 'Returned', 'Suicided']
    }
  }
};
exports.default = _default;
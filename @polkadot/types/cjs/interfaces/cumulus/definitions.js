"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _runtime = require("./runtime");
// Copyright 2017-2022 @polkadot/types authors & contributors
// SPDX-License-Identifier: Apache-2.0

// order important in structs... :)
/* eslint-disable sort-keys */

const dmpQueue = {
  CollationInfo: {
    upwardMessages: 'Vec<UpwardMessage>',
    horizontalMessages: 'Vec<OutboundHrmpMessage>',
    newValidationCode: 'Option<ValidationCode>',
    processedDownwardMessages: 'u32',
    hrmpWatermark: 'RelayBlockNumber',
    headData: 'HeadData'
  },
  CollationInfoV1: {
    upwardMessages: 'Vec<UpwardMessage>',
    horizontalMessages: 'Vec<OutboundHrmpMessage>',
    newValidationCode: 'Option<ValidationCode>',
    processedDownwardMessages: 'u32',
    hrmpWatermark: 'RelayBlockNumber'
  },
  ConfigData: {
    maxIndividual: 'Weight'
  },
  MessageId: '[u8; 32]',
  OverweightIndex: 'u64',
  PageCounter: 'u32',
  PageIndexData: {
    beginUsed: 'PageCounter',
    endUsed: 'PageCounter',
    overweightCount: 'OverweightIndex'
  }
};
var _default = {
  rpc: {},
  runtime: _runtime.runtime,
  types: dmpQueue
};
exports.default = _default;
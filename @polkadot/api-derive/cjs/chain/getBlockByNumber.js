"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getBlockByNumber = getBlockByNumber;
var _rxjs = require("rxjs");
var _util = require("../util");
// Copyright 2017-2022 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

function getBlockByNumber(instanceId, api) {
  return (0, _util.memo)(instanceId, blockNumber => api.rpc.chain.getBlockHash(blockNumber).pipe((0, _rxjs.switchMap)(h => api.derive.chain.getBlock(h))));
}
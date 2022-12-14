"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bestNumber = void 0;
var _util = require("./util");
// Copyright 2017-2022 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

/**
 * @name bestNumber
 * @returns The latest block number.
 * @example
 * <BR>
 *
 * ```javascript
 * api.derive.chain.bestNumber((blockNumber) => {
 *   console.log(`the current best block is #${blockNumber}`);
 * });
 * ```
 */
const bestNumber = (0, _util.createBlockNumberDerive)(api => api.rpc.chain.subscribeNewHeads());
exports.bestNumber = bestNumber;
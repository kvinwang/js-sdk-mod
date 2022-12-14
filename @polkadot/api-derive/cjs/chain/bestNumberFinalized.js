"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bestNumberFinalized = void 0;
var _util = require("./util");
// Copyright 2017-2022 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

/**
 * @name bestNumberFinalized
 * @returns A BlockNumber
 * @description Get the latest finalized block number.
 * @example
 * <BR>
 *
 * ```javascript
 * api.derive.chain.bestNumberFinalized((blockNumber) => {
 *   console.log(`the current finalized block is #${blockNumber}`);
 * });
 * ```
 */
const bestNumberFinalized = (0, _util.createBlockNumberDerive)(api => api.rpc.chain.subscribeFinalizedHeads());
exports.bestNumberFinalized = bestNumberFinalized;
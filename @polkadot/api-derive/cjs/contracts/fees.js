"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fees = fees;
var _rxjs = require("rxjs");
var _util = require("../util");
// Copyright 2017-2022 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

// query via constants (current applicable path)
function queryConstants(api) {
  return (0, _rxjs.of)([
  // deprecated
  api.consts.contracts.callBaseFee || api.registry.createType('Balance'), api.consts.contracts.contractFee || api.registry.createType('Balance'), api.consts.contracts.creationFee || api.registry.createType('Balance'), api.consts.contracts.transactionBaseFee || api.registry.createType('Balance'), api.consts.contracts.transactionByteFee || api.registry.createType('Balance'), api.consts.contracts.transferFee || api.registry.createType('Balance'),
  // current
  api.consts.contracts.rentByteFee, api.consts.contracts.rentDepositOffset, api.consts.contracts.surchargeReward, api.consts.contracts.tombstoneDeposit]);
}

/**
 * @name fees
 * @returns An object containing the combined results of the queries for
 * all relevant contract fees as declared in the substrate chain spec.
 * @example
 * <BR>
 *
 * ```javascript
 * api.derive.contracts.fees(([creationFee, transferFee]) => {
 *   console.log(`The fee for creating a new contract on this chain is ${creationFee} units. The fee required to call this contract is ${transferFee} units.`);
 * });
 * ```
 */
function fees(instanceId, api) {
  return (0, _util.memo)(instanceId, () => {
    return queryConstants(api).pipe((0, _rxjs.map)(_ref => {
      let [callBaseFee, contractFee, creationFee, transactionBaseFee, transactionByteFee, transferFee, rentByteFee, rentDepositOffset, surchargeReward, tombstoneDeposit] = _ref;
      return {
        callBaseFee,
        contractFee,
        creationFee,
        rentByteFee,
        rentDepositOffset,
        surchargeReward,
        tombstoneDeposit,
        transactionBaseFee,
        transactionByteFee,
        transferFee
      };
    }));
  });
}
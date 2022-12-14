// Copyright 2017-2022 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { combineLatest, map, of, switchMap } from 'rxjs';
import { isFunction, objectSpread } from '@polkadot/util';
import { memo } from "../util/index.js";
function zeroBalance(api) {
  return api.registry.createType('Balance');
}
function getBalance(api, [freeBalance, reservedBalance, frozenFee, frozenMisc]) {
  const votingBalance = api.registry.createType('Balance', freeBalance.toBn());
  return {
    freeBalance,
    frozenFee,
    frozenMisc,
    reservedBalance,
    votingBalance
  };
}
function calcBalances(api, [accountId, [accountNonce, [primary, ...additional]]]) {
  return objectSpread({
    accountId,
    accountNonce,
    additional: additional.map(b => getBalance(api, b))
  }, getBalance(api, primary));
}

// old
function queryBalancesFree(api, accountId) {
  return combineLatest([api.query.balances.freeBalance(accountId), api.query.balances.reservedBalance(accountId), api.query.system.accountNonce(accountId)]).pipe(map(([freeBalance, reservedBalance, accountNonce]) => [accountNonce, [[freeBalance, reservedBalance, zeroBalance(api), zeroBalance(api)]]]));
}
function queryNonceOnly(api, accountId) {
  const fill = nonce => [nonce, [[zeroBalance(api), zeroBalance(api), zeroBalance(api), zeroBalance(api)]]];
  return isFunction(api.query.system.account) ? api.query.system.account(accountId).pipe(map(({
    nonce
  }) => fill(nonce))) : isFunction(api.query.system.accountNonce) ? api.query.system.accountNonce(accountId).pipe(map(nonce => fill(nonce))) : of(fill(api.registry.createType('Index')));
}
function queryBalancesAccount(api, accountId, modules = ['balances']) {
  const balances = modules.map(m => {
    var _m, _api$query$m;
    return ((_m = api.derive[m]) == null ? void 0 : _m.customAccount) || ((_api$query$m = api.query[m]) == null ? void 0 : _api$query$m.account);
  }).filter(q => isFunction(q));
  const extract = (nonce, data) => [nonce, data.map(({
    feeFrozen,
    free,
    miscFrozen,
    reserved
  }) => [free, reserved, feeFrozen, miscFrozen])];

  // NOTE this is for the first case where we do have instances specified
  return balances.length ? isFunction(api.query.system.account) ? combineLatest([api.query.system.account(accountId), ...balances.map(c => c(accountId))]).pipe(map(([{
    nonce
  }, ...balances]) => extract(nonce, balances))) : combineLatest([api.query.system.accountNonce(accountId), ...balances.map(c => c(accountId))]).pipe(map(([nonce, ...balances]) => extract(nonce, balances))) : queryNonceOnly(api, accountId);
}
function querySystemAccount(api, accountId) {
  // AccountInfo is current, support old, eg. Edgeware
  return api.query.system.account(accountId).pipe(map(infoOrTuple => {
    const data = infoOrTuple.nonce ? infoOrTuple.data : infoOrTuple[1];
    const nonce = infoOrTuple.nonce || infoOrTuple[0];
    if (!data || data.isEmpty) {
      return [nonce, [[zeroBalance(api), zeroBalance(api), zeroBalance(api), zeroBalance(api)]]];
    }
    const {
      feeFrozen,
      free,
      miscFrozen,
      reserved
    } = data;
    return [nonce, [[free, reserved, feeFrozen, miscFrozen]]];
  }));
}

/**
 * @name account
 * @param {( AccountIndex | AccountId | Address | string )} address - An accounts Id in different formats.
 * @returns An object containing the results of various balance queries
 * @example
 * <BR>
 *
 * ```javascript
 * const ALICE = 'F7Hs';
 *
 * api.derive.balances.all(ALICE, ({ accountId, lockedBalance }) => {
 *   console.log(`The account ${accountId} has a locked balance ${lockedBalance} units.`);
 * });
 * ```
 */
export function account(instanceId, api) {
  const balanceInstances = api.registry.getModuleInstances(api.runtimeVersion.specName, 'balances');
  const nonDefaultBalances = balanceInstances && (balanceInstances.length !== 1 || balanceInstances[0] !== 'balances');
  return memo(instanceId, address => api.derive.accounts.accountId(address).pipe(switchMap(accountId => {
    var _api$query$system, _api$query$balances, _api$query$balances2;
    return accountId ? combineLatest([of(accountId), nonDefaultBalances ? queryBalancesAccount(api, accountId, balanceInstances) : isFunction((_api$query$system = api.query.system) == null ? void 0 : _api$query$system.account) ? querySystemAccount(api, accountId) : isFunction((_api$query$balances = api.query.balances) == null ? void 0 : _api$query$balances.account) ? queryBalancesAccount(api, accountId) : isFunction((_api$query$balances2 = api.query.balances) == null ? void 0 : _api$query$balances2.freeBalance) ? queryBalancesFree(api, accountId) : queryNonceOnly(api, accountId)]) : of([api.registry.createType('AccountId'), [api.registry.createType('Index'), [[zeroBalance(api), zeroBalance(api), zeroBalance(api), zeroBalance(api)]]]]);
  }), map(result => calcBalances(api, result))));
}
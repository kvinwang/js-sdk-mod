// Copyright 2017-2022 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { combineLatest, map, of, switchMap } from 'rxjs';
import { BN, BN_ZERO, bnMax, bnMin, isFunction, objectSpread } from '@polkadot/util';
import { memo } from "../util/index.js";
const VESTING_ID = '0x76657374696e6720';
function calcLocked(api, bestNumber, locks) {
  let lockedBalance = api.registry.createType('Balance');
  let lockedBreakdown = [];
  let vestingLocked = api.registry.createType('Balance');
  let allLocked = false;
  if (Array.isArray(locks)) {
    // only get the locks that are valid until passed the current block
    lockedBreakdown = locks.filter(({
      until
    }) => !until || bestNumber && until.gt(bestNumber));
    allLocked = lockedBreakdown.some(({
      amount
    }) => amount && amount.isMax());
    vestingLocked = api.registry.createType('Balance', lockedBreakdown.filter(({
      id
    }) => id.eq(VESTING_ID)).reduce((result, {
      amount
    }) => result.iadd(amount), new BN(0)));

    // get the maximum of the locks according to https://github.com/paritytech/substrate/blob/master/srml/balances/src/lib.rs#L699
    const notAll = lockedBreakdown.filter(({
      amount
    }) => amount && !amount.isMax());
    if (notAll.length) {
      lockedBalance = api.registry.createType('Balance', bnMax(...notAll.map(({
        amount
      }) => amount)));
    }
  }
  return {
    allLocked,
    lockedBalance,
    lockedBreakdown,
    vestingLocked
  };
}
function calcShared(api, bestNumber, data, locks) {
  const {
    allLocked,
    lockedBalance,
    lockedBreakdown,
    vestingLocked
  } = calcLocked(api, bestNumber, locks);
  return objectSpread({}, data, {
    availableBalance: api.registry.createType('Balance', allLocked ? 0 : bnMax(new BN(0), data.freeBalance.sub(lockedBalance))),
    lockedBalance,
    lockedBreakdown,
    vestingLocked
  });
}
function calcVesting(bestNumber, shared, _vesting) {
  // Calculate the vesting balances,
  //  - offset = balance locked at startingBlock
  //  - perBlock is the unlock amount
  const vesting = _vesting || [];
  const isVesting = !shared.vestingLocked.isZero();
  const vestedBalances = vesting.map(({
    locked,
    perBlock,
    startingBlock
  }) => bestNumber.gt(startingBlock) ? bnMin(locked, perBlock.mul(bestNumber.sub(startingBlock))) : BN_ZERO);
  const vestedBalance = vestedBalances.reduce((all, value) => all.iadd(value), new BN(0));
  const vestingTotal = vesting.reduce((all, {
    locked
  }) => all.iadd(locked), new BN(0));
  return {
    isVesting,
    vestedBalance,
    vestedClaimable: isVesting ? shared.vestingLocked.sub(vestingTotal.sub(vestedBalance)) : BN_ZERO,
    vesting: vesting.map(({
      locked,
      perBlock,
      startingBlock
    }, index) => ({
      endBlock: locked.div(perBlock).iadd(startingBlock),
      locked,
      perBlock,
      startingBlock,
      vested: vestedBalances[index]
    })).filter(({
      locked
    }) => !locked.isZero()),
    vestingTotal
  };
}
function calcBalances(api, [data, [vesting, allLocks, namedReserves], bestNumber]) {
  const shared = calcShared(api, bestNumber, data, allLocks[0]);
  return objectSpread(shared, calcVesting(bestNumber, shared, vesting), {
    accountId: data.accountId,
    accountNonce: data.accountNonce,
    additional: allLocks.slice(1).map((l, index) => calcShared(api, bestNumber, data.additional[index], l)),
    namedReserves
  });
}

// old
function queryOld(api, accountId) {
  return combineLatest([api.query.balances.locks(accountId), api.query.balances.vesting(accountId)]).pipe(map(([locks, optVesting]) => {
    let vestingNew = null;
    if (optVesting.isSome) {
      const {
        offset: locked,
        perBlock,
        startingBlock
      } = optVesting.unwrap();
      vestingNew = api.registry.createType('VestingInfo', {
        locked,
        perBlock,
        startingBlock
      });
    }
    return [vestingNew ? [vestingNew] : null, [locks], []];
  }));
}
const isNonNullable = nullable => !!nullable;
function createCalls(calls) {
  return [calls.map(c => !c), calls.filter(isNonNullable)];
}

// current (balances, vesting)
function queryCurrent(api, accountId, balanceInstances = ['balances']) {
  var _api$query$vesting;
  const [lockEmpty, lockQueries] = createCalls(balanceInstances.map(m => {
    var _m, _api$query;
    return ((_m = api.derive[m]) == null ? void 0 : _m.customLocks) || ((_api$query = api.query[m]) == null ? void 0 : _api$query.locks);
  }));
  const [reserveEmpty, reserveQueries] = createCalls(balanceInstances.map(m => {
    var _api$query2;
    return (_api$query2 = api.query[m]) == null ? void 0 : _api$query2.reserves;
  }));
  return combineLatest([(_api$query$vesting = api.query.vesting) != null && _api$query$vesting.vesting ? api.query.vesting.vesting(accountId) : of(api.registry.createType('Option<VestingInfo>')), lockQueries.length ? combineLatest(lockQueries.map(c => c(accountId))) : of([]), reserveQueries.length ? combineLatest(reserveQueries.map(c => c(accountId))) : of([])]).pipe(map(([opt, locks, reserves]) => {
    let offsetLock = -1;
    let offsetReserve = -1;
    const vesting = opt.unwrapOr(null);
    return [vesting ? Array.isArray(vesting) ? vesting : [vesting] : null, lockEmpty.map(e => e ? api.registry.createType('Vec<BalanceLock>') : locks[++offsetLock]), reserveEmpty.map(e => e ? api.registry.createType('Vec<PalletBalancesReserveData>') : reserves[++offsetReserve])];
  }));
}

/**
 * @name all
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
export function all(instanceId, api) {
  const balanceInstances = api.registry.getModuleInstances(api.runtimeVersion.specName, 'balances');
  return memo(instanceId, address => {
    var _api$query$system, _api$query$balances;
    return combineLatest([api.derive.balances.account(address), isFunction((_api$query$system = api.query.system) == null ? void 0 : _api$query$system.account) || isFunction((_api$query$balances = api.query.balances) == null ? void 0 : _api$query$balances.account) ? queryCurrent(api, address, balanceInstances) : queryOld(api, address)]).pipe(switchMap(([account, locks]) => combineLatest([of(account), of(locks), api.derive.chain.bestNumber()])), map(result => calcBalances(api, result)));
  });
}
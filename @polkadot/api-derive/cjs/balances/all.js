"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.all = all;
var _rxjs = require("rxjs");
var _util = require("@polkadot/util");
var _util2 = require("../util");
// Copyright 2017-2022 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

const VESTING_ID = '0x76657374696e6720';
function calcLocked(api, bestNumber, locks) {
  let lockedBalance = api.registry.createType('Balance');
  let lockedBreakdown = [];
  let vestingLocked = api.registry.createType('Balance');
  let allLocked = false;
  if (Array.isArray(locks)) {
    // only get the locks that are valid until passed the current block
    lockedBreakdown = locks.filter(_ref => {
      let {
        until
      } = _ref;
      return !until || bestNumber && until.gt(bestNumber);
    });
    allLocked = lockedBreakdown.some(_ref2 => {
      let {
        amount
      } = _ref2;
      return amount && amount.isMax();
    });
    vestingLocked = api.registry.createType('Balance', lockedBreakdown.filter(_ref3 => {
      let {
        id
      } = _ref3;
      return id.eq(VESTING_ID);
    }).reduce((result, _ref4) => {
      let {
        amount
      } = _ref4;
      return result.iadd(amount);
    }, new _util.BN(0)));

    // get the maximum of the locks according to https://github.com/paritytech/substrate/blob/master/srml/balances/src/lib.rs#L699
    const notAll = lockedBreakdown.filter(_ref5 => {
      let {
        amount
      } = _ref5;
      return amount && !amount.isMax();
    });
    if (notAll.length) {
      lockedBalance = api.registry.createType('Balance', (0, _util.bnMax)(...notAll.map(_ref6 => {
        let {
          amount
        } = _ref6;
        return amount;
      })));
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
  return (0, _util.objectSpread)({}, data, {
    availableBalance: api.registry.createType('Balance', allLocked ? 0 : (0, _util.bnMax)(new _util.BN(0), data.freeBalance.sub(lockedBalance))),
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
  const vestedBalances = vesting.map(_ref7 => {
    let {
      locked,
      perBlock,
      startingBlock
    } = _ref7;
    return bestNumber.gt(startingBlock) ? (0, _util.bnMin)(locked, perBlock.mul(bestNumber.sub(startingBlock))) : _util.BN_ZERO;
  });
  const vestedBalance = vestedBalances.reduce((all, value) => all.iadd(value), new _util.BN(0));
  const vestingTotal = vesting.reduce((all, _ref8) => {
    let {
      locked
    } = _ref8;
    return all.iadd(locked);
  }, new _util.BN(0));
  return {
    isVesting,
    vestedBalance,
    vestedClaimable: isVesting ? shared.vestingLocked.sub(vestingTotal.sub(vestedBalance)) : _util.BN_ZERO,
    vesting: vesting.map((_ref9, index) => {
      let {
        locked,
        perBlock,
        startingBlock
      } = _ref9;
      return {
        endBlock: locked.div(perBlock).iadd(startingBlock),
        locked,
        perBlock,
        startingBlock,
        vested: vestedBalances[index]
      };
    }).filter(_ref10 => {
      let {
        locked
      } = _ref10;
      return !locked.isZero();
    }),
    vestingTotal
  };
}
function calcBalances(api, _ref11) {
  let [data, [vesting, allLocks, namedReserves], bestNumber] = _ref11;
  const shared = calcShared(api, bestNumber, data, allLocks[0]);
  return (0, _util.objectSpread)(shared, calcVesting(bestNumber, shared, vesting), {
    accountId: data.accountId,
    accountNonce: data.accountNonce,
    additional: allLocks.slice(1).map((l, index) => calcShared(api, bestNumber, data.additional[index], l)),
    namedReserves
  });
}

// old
function queryOld(api, accountId) {
  return (0, _rxjs.combineLatest)([api.query.balances.locks(accountId), api.query.balances.vesting(accountId)]).pipe((0, _rxjs.map)(_ref12 => {
    let [locks, optVesting] = _ref12;
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
function queryCurrent(api, accountId) {
  var _api$query$vesting;
  let balanceInstances = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ['balances'];
  const [lockEmpty, lockQueries] = createCalls(balanceInstances.map(m => {
    var _m, _api$query;
    return ((_m = api.derive[m]) == null ? void 0 : _m.customLocks) || ((_api$query = api.query[m]) == null ? void 0 : _api$query.locks);
  }));
  const [reserveEmpty, reserveQueries] = createCalls(balanceInstances.map(m => {
    var _api$query2;
    return (_api$query2 = api.query[m]) == null ? void 0 : _api$query2.reserves;
  }));
  return (0, _rxjs.combineLatest)([(_api$query$vesting = api.query.vesting) != null && _api$query$vesting.vesting ? api.query.vesting.vesting(accountId) : (0, _rxjs.of)(api.registry.createType('Option<VestingInfo>')), lockQueries.length ? (0, _rxjs.combineLatest)(lockQueries.map(c => c(accountId))) : (0, _rxjs.of)([]), reserveQueries.length ? (0, _rxjs.combineLatest)(reserveQueries.map(c => c(accountId))) : (0, _rxjs.of)([])]).pipe((0, _rxjs.map)(_ref13 => {
    let [opt, locks, reserves] = _ref13;
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
function all(instanceId, api) {
  const balanceInstances = api.registry.getModuleInstances(api.runtimeVersion.specName, 'balances');
  return (0, _util2.memo)(instanceId, address => {
    var _api$query$system, _api$query$balances;
    return (0, _rxjs.combineLatest)([api.derive.balances.account(address), (0, _util.isFunction)((_api$query$system = api.query.system) == null ? void 0 : _api$query$system.account) || (0, _util.isFunction)((_api$query$balances = api.query.balances) == null ? void 0 : _api$query$balances.account) ? queryCurrent(api, address, balanceInstances) : queryOld(api, address)]).pipe((0, _rxjs.switchMap)(_ref14 => {
      let [account, locks] = _ref14;
      return (0, _rxjs.combineLatest)([(0, _rxjs.of)(account), (0, _rxjs.of)(locks), api.derive.chain.bestNumber()]);
    }), (0, _rxjs.map)(result => calcBalances(api, result)));
  });
}
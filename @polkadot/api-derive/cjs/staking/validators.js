"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.nextElected = nextElected;
exports.validators = validators;
var _rxjs = require("rxjs");
var _util = require("../util");
// Copyright 2017-2022 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

function nextElected(instanceId, api) {
  return (0, _util.memo)(instanceId, () => api.query.staking.erasStakers ? api.derive.session.indexes().pipe(
  // only populate for next era in the last session, so track both here - entries are not
  // subscriptions, so we need a trigger - currentIndex acts as that trigger to refresh
  (0, _rxjs.switchMap)(_ref => {
    let {
      currentEra
    } = _ref;
    return api.query.staking.erasStakers.keys(currentEra);
  }), (0, _rxjs.map)(keys => keys.map(_ref2 => {
    let {
      args: [, accountId]
    } = _ref2;
    return accountId;
  }))) : api.query.staking.currentElected());
}

/**
 * @description Retrieve latest list of validators
 */
function validators(instanceId, api) {
  return (0, _util.memo)(instanceId, () =>
  // Sadly the node-template is (for some obscure reason) not comprehensive, so while the derive works
  // in all actual real-world deployed chains, it does create some confusion for limited template chains
  (0, _rxjs.combineLatest)([api.query.session ? api.query.session.validators() : (0, _rxjs.of)([]), api.query.staking ? api.derive.staking.nextElected() : (0, _rxjs.of)([])]).pipe((0, _rxjs.map)(_ref3 => {
    let [validators, nextElected] = _ref3;
    return {
      nextElected: nextElected.length ? nextElected : validators,
      validators
    };
  })));
}
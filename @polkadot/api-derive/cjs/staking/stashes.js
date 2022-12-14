"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stashes = stashes;
var _rxjs = require("rxjs");
var _util = require("../util");
// Copyright 2017-2022 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

function onBondedEvent(api) {
  let current = Date.now();
  return api.query.system.events().pipe((0, _rxjs.map)(events => {
    current = events.filter(_ref => {
      let {
        event,
        phase
      } = _ref;
      try {
        return phase.isApplyExtrinsic && event.section === 'staking' && event.method === 'Bonded';
      } catch {
        return false;
      }
    }) ? Date.now() : current;
    return current;
  }), (0, _rxjs.startWith)(current), (0, _util.drr)({
    skipTimeout: true
  }));
}

/**
 * @description Retrieve the list of all validator stashes
 */
function stashes(instanceId, api) {
  return (0, _util.memo)(instanceId, () => onBondedEvent(api).pipe((0, _rxjs.switchMap)(() => api.query.staking.validators.keys()), (0, _rxjs.map)(keys => keys.map(_ref2 => {
    let {
      args: [v]
    } = _ref2;
    return v;
  }).filter(a => a))));
}
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.waitingInfo = waitingInfo;
var _rxjs = require("rxjs");
var _util = require("../util");
// Copyright 2017-2022 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

const DEFAULT_FLAGS = {
  withController: true,
  withPrefs: true
};
function waitingInfo(instanceId, api) {
  return (0, _util.memo)(instanceId, function () {
    let flags = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : DEFAULT_FLAGS;
    return (0, _rxjs.combineLatest)([api.derive.staking.validators(), api.derive.staking.stashes()]).pipe((0, _rxjs.switchMap)(_ref => {
      let [{
        nextElected
      }, stashes] = _ref;
      const elected = nextElected.map(a => a.toString());
      const waiting = stashes.filter(v => !elected.includes(v.toString()));
      return api.derive.staking.queryMulti(waiting, flags).pipe((0, _rxjs.map)(info => ({
        info,
        waiting
      })));
    }));
  });
}
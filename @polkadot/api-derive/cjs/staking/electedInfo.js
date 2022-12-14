"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.electedInfo = electedInfo;
var _rxjs = require("rxjs");
var _util = require("@polkadot/util");
var _util2 = require("../util");
// Copyright 2017-2022 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

const DEFAULT_FLAGS = {
  withController: true,
  withExposure: true,
  withPrefs: true
};
function combineAccounts(nextElected, validators) {
  return (0, _util.arrayFlatten)([nextElected, validators.filter(v => !nextElected.find(n => n.eq(v)))]);
}
function electedInfo(instanceId, api) {
  return (0, _util2.memo)(instanceId, function () {
    let flags = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : DEFAULT_FLAGS;
    return api.derive.staking.validators().pipe((0, _rxjs.switchMap)(_ref => {
      let {
        nextElected,
        validators
      } = _ref;
      return api.derive.staking.queryMulti(combineAccounts(nextElected, validators), flags).pipe((0, _rxjs.map)(info => ({
        info,
        nextElected,
        validators
      })));
    }));
  });
}
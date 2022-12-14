"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._stakerSlashes = _stakerSlashes;
exports.stakerSlashes = void 0;
var _rxjs = require("rxjs");
var _util = require("../util");
var _util2 = require("./util");
// Copyright 2017-2022 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

function _stakerSlashes(instanceId, api) {
  return (0, _util.memo)(instanceId, (accountId, eras, withActive) => {
    const stakerId = api.registry.createType('AccountId', accountId).toString();
    return api.derive.staking._erasSlashes(eras, withActive).pipe((0, _rxjs.map)(slashes => slashes.map(_ref => {
      let {
        era,
        nominators,
        validators
      } = _ref;
      return {
        era,
        total: nominators[stakerId] || validators[stakerId] || api.registry.createType('Balance')
      };
    })));
  });
}
const stakerSlashes = (0, _util2.erasHistoricApplyAccount)('_stakerSlashes');
exports.stakerSlashes = stakerSlashes;
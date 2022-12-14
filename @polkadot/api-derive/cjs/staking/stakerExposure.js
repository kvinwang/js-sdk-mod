"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._stakerExposures = _stakerExposures;
exports.stakerExposure = void 0;
exports.stakerExposures = stakerExposures;
var _rxjs = require("rxjs");
var _util = require("../util");
// Copyright 2017-2022 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

function _stakerExposures(instanceId, api) {
  return (0, _util.memo)(instanceId, function (accountIds, eras) {
    let withActive = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    const stakerIds = accountIds.map(a => api.registry.createType('AccountId', a).toString());
    return api.derive.staking._erasExposure(eras, withActive).pipe((0, _rxjs.map)(exposures => stakerIds.map(stakerId => exposures.map(_ref => {
      let {
        era,
        nominators: allNominators,
        validators: allValidators
      } = _ref;
      const isValidator = !!allValidators[stakerId];
      const validators = {};
      const nominating = allNominators[stakerId] || [];
      if (isValidator) {
        validators[stakerId] = allValidators[stakerId];
      } else if (nominating) {
        nominating.forEach(_ref2 => {
          let {
            validatorId
          } = _ref2;
          validators[validatorId] = allValidators[validatorId];
        });
      }
      return {
        era,
        isEmpty: !Object.keys(validators).length,
        isValidator,
        nominating,
        validators
      };
    }))));
  });
}
function stakerExposures(instanceId, api) {
  return (0, _util.memo)(instanceId, function (accountIds) {
    let withActive = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    return api.derive.staking.erasHistoric(withActive).pipe((0, _rxjs.switchMap)(eras => api.derive.staking._stakerExposures(accountIds, eras, withActive)));
  });
}
const stakerExposure = (0, _util.firstMemo)((api, accountId, withActive) => api.derive.staking.stakerExposures([accountId], withActive));
exports.stakerExposure = stakerExposure;
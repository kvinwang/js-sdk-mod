"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.candidates = candidates;
var _rxjs = require("rxjs");
var _util = require("../util");
// Copyright 2017-2022 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

/**
 * @description Get the candidate info for a society
 */
function candidates(instanceId, api) {
  return (0, _util.memo)(instanceId, () => api.query.society.candidates().pipe((0, _rxjs.switchMap)(candidates => (0, _rxjs.combineLatest)([(0, _rxjs.of)(candidates), api.query.society.suspendedCandidates.multi(candidates.map(_ref => {
    let {
      who
    } = _ref;
    return who;
  }))])), (0, _rxjs.map)(_ref2 => {
    let [candidates, suspended] = _ref2;
    return candidates.map((_ref3, index) => {
      let {
        kind,
        value,
        who
      } = _ref3;
      return {
        accountId: who,
        isSuspended: suspended[index].isSome,
        kind,
        value
      };
    });
  })));
}
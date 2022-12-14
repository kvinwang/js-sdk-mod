"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.receivedHeartbeats = receivedHeartbeats;
var _rxjs = require("rxjs");
var _util = require("@polkadot/util");
var _util2 = require("../util");
// Copyright 2017-2022 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

function mapResult(_ref) {
  let [result, validators, heartbeats, numBlocks] = _ref;
  validators.forEach((validator, index) => {
    const validatorId = validator.toString();
    const blockCount = numBlocks[index];
    const hasMessage = !heartbeats[index].isEmpty;
    const prev = result[validatorId];
    if (!prev || prev.hasMessage !== hasMessage || !prev.blockCount.eq(blockCount)) {
      result[validatorId] = {
        blockCount,
        hasMessage,
        isOnline: hasMessage || blockCount.gt(_util.BN_ZERO)
      };
    }
  });
  return result;
}

/**
 * @description Return a boolean array indicating whether the passed accounts had received heartbeats in the current session
 */
function receivedHeartbeats(instanceId, api) {
  return (0, _util2.memo)(instanceId, () => {
    var _api$query$imOnline;
    return (_api$query$imOnline = api.query.imOnline) != null && _api$query$imOnline.receivedHeartbeats ? api.derive.staking.overview().pipe((0, _rxjs.switchMap)(_ref2 => {
      let {
        currentIndex,
        validators
      } = _ref2;
      return (0, _rxjs.combineLatest)([(0, _rxjs.of)({}), (0, _rxjs.of)(validators), api.query.imOnline.receivedHeartbeats.multi(validators.map((_address, index) => [currentIndex, index])), api.query.imOnline.authoredBlocks.multi(validators.map(address => [currentIndex, address]))]);
    }), (0, _rxjs.map)(mapResult)) : (0, _rxjs.of)({});
  });
}
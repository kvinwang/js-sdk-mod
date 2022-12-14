"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.erasHistoric = erasHistoric;
var _rxjs = require("rxjs");
var _util = require("@polkadot/util");
var _util2 = require("../util");
// Copyright 2017-2022 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

function erasHistoric(instanceId, api) {
  return (0, _util2.memo)(instanceId, withActive => (0, _rxjs.combineLatest)([api.query.staking.activeEra(), api.consts.staking.historyDepth ? (0, _rxjs.of)(api.consts.staking.historyDepth) : api.query.staking.historyDepth()]).pipe((0, _rxjs.map)(_ref => {
    let [activeEraOpt, historyDepth] = _ref;
    const result = [];
    const max = historyDepth.toNumber();
    const activeEra = activeEraOpt.unwrapOrDefault().index;
    let lastEra = activeEra;
    while (lastEra.gte(_util.BN_ZERO) && result.length < max) {
      if (lastEra !== activeEra || withActive === true) {
        result.push(api.registry.createType('EraIndex', lastEra));
      }
      lastEra = lastEra.sub(_util.BN_ONE);
    }

    // go from oldest to newest
    return result.reverse();
  })));
}
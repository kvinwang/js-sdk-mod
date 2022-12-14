"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._stakerPrefs = _stakerPrefs;
exports.stakerPrefs = void 0;
var _rxjs = require("rxjs");
var _util = require("../util");
var _util2 = require("./util");
// Copyright 2017-2022 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

function _stakerPrefs(instanceId, api) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return (0, _util.memo)(instanceId, (accountId, eras, _withActive) => api.query.staking.erasValidatorPrefs.multi(eras.map(e => [e, accountId])).pipe((0, _rxjs.map)(all => all.map((validatorPrefs, index) => ({
    era: eras[index],
    validatorPrefs
  })))));
}
const stakerPrefs = (0, _util2.erasHistoricApplyAccount)('_stakerPrefs');
exports.stakerPrefs = stakerPrefs;
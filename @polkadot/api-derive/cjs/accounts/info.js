"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.info = info;
var _rxjs = require("rxjs");
var _util = require("@polkadot/util");
var _util2 = require("../util");
// Copyright 2017-2022 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

function retrieveNick(api, accountId) {
  var _api$query$nicks;
  return (accountId && (_api$query$nicks = api.query.nicks) != null && _api$query$nicks.nameOf ? api.query.nicks.nameOf(accountId) : (0, _rxjs.of)(undefined)).pipe((0, _rxjs.map)(nameOf => nameOf != null && nameOf.isSome ? (0, _util.u8aToString)(nameOf.unwrap()[0]).substring(0, api.consts.nicks.maxLength.toNumber()) : undefined));
}

/**
 * @name info
 * @description Returns aux. info with regards to an account, current that includes the accountId, accountIndex and nickname
 */
function info(instanceId, api) {
  return (0, _util2.memo)(instanceId, address => api.derive.accounts.idAndIndex(address).pipe((0, _rxjs.switchMap)(_ref => {
    let [accountId, accountIndex] = _ref;
    return (0, _rxjs.combineLatest)([(0, _rxjs.of)({
      accountId,
      accountIndex
    }), api.derive.accounts.identity(accountId), retrieveNick(api, accountId)]);
  }), (0, _rxjs.map)(_ref2 => {
    let [{
      accountId,
      accountIndex
    }, identity, nickname] = _ref2;
    return {
      accountId,
      accountIndex,
      identity,
      nickname
    };
  })));
}
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.signingInfo = signingInfo;
var _rxjs = require("rxjs");
var _util = require("@polkadot/util");
var _util2 = require("../util");
var _constants = require("./constants");
// Copyright 2017-2022 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

function latestNonce(api, address) {
  return api.derive.balances.account(address).pipe((0, _rxjs.map)(_ref => {
    let {
      accountNonce
    } = _ref;
    return accountNonce;
  }));
}
function nextNonce(api, address) {
  var _api$rpc$system;
  return (_api$rpc$system = api.rpc.system) != null && _api$rpc$system.accountNextIndex ? api.rpc.system.accountNextIndex(address) : latestNonce(api, address);
}
function signingHeader(api) {
  return (0, _rxjs.combineLatest)([api.rpc.chain.getHeader().pipe((0, _rxjs.switchMap)(header =>
  // check for chains at genesis (until block 1 is produced, e.g. 6s), since
  // we do need to allow transactions at chain start (also dev/seal chains)
  header.parentHash.isEmpty ? (0, _rxjs.of)(header)
  // in the case of the current block, we use the parent to minimize the
  // impact of forks on the system, but not completely remove it
  : api.rpc.chain.getHeader(header.parentHash))), api.rpc.chain.getFinalizedHead().pipe((0, _rxjs.switchMap)(hash => api.rpc.chain.getHeader(hash)))]).pipe((0, _rxjs.map)(_ref2 => {
    let [current, finalized] = _ref2;
    return (
      // determine the hash to use, current when lag > max, else finalized
      (0, _util2.unwrapBlockNumber)(current).sub((0, _util2.unwrapBlockNumber)(finalized)).gt(_constants.MAX_FINALITY_LAG) ? current : finalized
    );
  }));
}
function signingInfo(_instanceId, api) {
  // no memo, we want to do this fresh on each run
  return (address, nonce, era) => (0, _rxjs.combineLatest)([
  // retrieve nonce if none was specified
  (0, _util.isUndefined)(nonce) ? latestNonce(api, address) : nonce === -1 ? nextNonce(api, address) : (0, _rxjs.of)(api.registry.createType('Index', nonce)),
  // if no era (create) or era > 0 (mortal), do block retrieval
  (0, _util.isUndefined)(era) || (0, _util.isNumber)(era) && era > 0 ? signingHeader(api) : (0, _rxjs.of)(null)]).pipe((0, _rxjs.map)(_ref3 => {
    var _api$consts$system, _api$consts$system$bl, _api$consts$babe, _api$consts$timestamp;
    let [nonce, header] = _ref3;
    return {
      header,
      mortalLength: Math.min(((_api$consts$system = api.consts.system) == null ? void 0 : (_api$consts$system$bl = _api$consts$system.blockHashCount) == null ? void 0 : _api$consts$system$bl.toNumber()) || _constants.FALLBACK_MAX_HASH_COUNT, _constants.MORTAL_PERIOD.div(((_api$consts$babe = api.consts.babe) == null ? void 0 : _api$consts$babe.expectedBlockTime) || ((_api$consts$timestamp = api.consts.timestamp) == null ? void 0 : _api$consts$timestamp.minimumPeriod.muln(2)) || _constants.FALLBACK_PERIOD).iadd(_constants.MAX_FINALITY_LAG).toNumber()),
      nonce
    };
  }));
}
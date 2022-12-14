// Copyright 2017-2022 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { combineLatest, map, of, switchMap } from 'rxjs';
import { isNumber, isUndefined } from '@polkadot/util';
import { unwrapBlockNumber } from "../util/index.js";
import { FALLBACK_MAX_HASH_COUNT, FALLBACK_PERIOD, MAX_FINALITY_LAG, MORTAL_PERIOD } from "./constants.js";
function latestNonce(api, address) {
  return api.derive.balances.account(address).pipe(map(({
    accountNonce
  }) => accountNonce));
}
function nextNonce(api, address) {
  var _api$rpc$system;
  return (_api$rpc$system = api.rpc.system) != null && _api$rpc$system.accountNextIndex ? api.rpc.system.accountNextIndex(address) : latestNonce(api, address);
}
function signingHeader(api) {
  return combineLatest([api.rpc.chain.getHeader().pipe(switchMap(header =>
  // check for chains at genesis (until block 1 is produced, e.g. 6s), since
  // we do need to allow transactions at chain start (also dev/seal chains)
  header.parentHash.isEmpty ? of(header)
  // in the case of the current block, we use the parent to minimize the
  // impact of forks on the system, but not completely remove it
  : api.rpc.chain.getHeader(header.parentHash))), api.rpc.chain.getFinalizedHead().pipe(switchMap(hash => api.rpc.chain.getHeader(hash)))]).pipe(map(([current, finalized]) =>
  // determine the hash to use, current when lag > max, else finalized
  unwrapBlockNumber(current).sub(unwrapBlockNumber(finalized)).gt(MAX_FINALITY_LAG) ? current : finalized));
}
export function signingInfo(_instanceId, api) {
  // no memo, we want to do this fresh on each run
  return (address, nonce, era) => combineLatest([
  // retrieve nonce if none was specified
  isUndefined(nonce) ? latestNonce(api, address) : nonce === -1 ? nextNonce(api, address) : of(api.registry.createType('Index', nonce)),
  // if no era (create) or era > 0 (mortal), do block retrieval
  isUndefined(era) || isNumber(era) && era > 0 ? signingHeader(api) : of(null)]).pipe(map(([nonce, header]) => {
    var _api$consts$system, _api$consts$system$bl, _api$consts$babe, _api$consts$timestamp;
    return {
      header,
      mortalLength: Math.min(((_api$consts$system = api.consts.system) == null ? void 0 : (_api$consts$system$bl = _api$consts$system.blockHashCount) == null ? void 0 : _api$consts$system$bl.toNumber()) || FALLBACK_MAX_HASH_COUNT, MORTAL_PERIOD.div(((_api$consts$babe = api.consts.babe) == null ? void 0 : _api$consts$babe.expectedBlockTime) || ((_api$consts$timestamp = api.consts.timestamp) == null ? void 0 : _api$consts$timestamp.minimumPeriod.muln(2)) || FALLBACK_PERIOD).iadd(MAX_FINALITY_LAG).toNumber()),
      nonce
    };
  }));
}
// Copyright 2017-2022 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { combineLatest, map, of, switchMap } from 'rxjs';
import { u8aToString } from '@polkadot/util';
import { memo } from "../util/index.js";
function retrieveNick(api, accountId) {
  var _api$query$nicks;
  return (accountId && (_api$query$nicks = api.query.nicks) != null && _api$query$nicks.nameOf ? api.query.nicks.nameOf(accountId) : of(undefined)).pipe(map(nameOf => nameOf != null && nameOf.isSome ? u8aToString(nameOf.unwrap()[0]).substring(0, api.consts.nicks.maxLength.toNumber()) : undefined));
}

/**
 * @name info
 * @description Returns aux. info with regards to an account, current that includes the accountId, accountIndex and nickname
 */
export function info(instanceId, api) {
  return memo(instanceId, address => api.derive.accounts.idAndIndex(address).pipe(switchMap(([accountId, accountIndex]) => combineLatest([of({
    accountId,
    accountIndex
  }), api.derive.accounts.identity(accountId), retrieveNick(api, accountId)])), map(([{
    accountId,
    accountIndex
  }, identity, nickname]) => ({
    accountId,
    accountIndex,
    identity,
    nickname
  }))));
}
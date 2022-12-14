// Copyright 2017-2022 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { combineLatest, map, of, switchMap } from 'rxjs';
import { isHex, u8aToString } from '@polkadot/util';
import { firstMemo, memo } from "../util/index.js";
const UNDEF_HEX = {
  toHex: () => undefined
};
function dataAsString(data) {
  return data.isRaw ? u8aToString(data.asRaw.toU8a(true)) : data.isNone ? undefined : data.toHex();
}
function extractOther(additional) {
  return additional.reduce((other, [_key, _value]) => {
    const key = dataAsString(_key);
    const value = dataAsString(_value);
    if (key && value) {
      other[key] = value;
    }
    return other;
  }, {});
}
function extractIdentity(identityOfOpt, superOf) {
  if (!(identityOfOpt != null && identityOfOpt.isSome)) {
    return {
      judgements: []
    };
  }
  const {
    info,
    judgements
  } = identityOfOpt.unwrap();
  const topDisplay = dataAsString(info.display);
  return {
    display: superOf && dataAsString(superOf[1]) || topDisplay,
    displayParent: superOf && topDisplay,
    email: dataAsString(info.email),
    image: dataAsString(info.image),
    judgements,
    legal: dataAsString(info.legal),
    other: extractOther(info.additional),
    parent: superOf && superOf[0],
    pgp: info.pgpFingerprint.unwrapOr(UNDEF_HEX).toHex(),
    riot: dataAsString(info.riot),
    twitter: dataAsString(info.twitter),
    web: dataAsString(info.web)
  };
}
function getParent(api, identityOfOpt, superOfOpt) {
  if (identityOfOpt != null && identityOfOpt.isSome) {
    // this identity has something set
    return of([identityOfOpt, undefined]);
  } else if (superOfOpt != null && superOfOpt.isSome) {
    const superOf = superOfOpt.unwrap();
    return combineLatest([api.derive.accounts._identity(superOf[0]).pipe(map(([info]) => info)), of(superOf)]);
  }

  // nothing of value returned
  return of([undefined, undefined]);
}
export function _identity(instanceId, api) {
  return memo(instanceId, accountId => {
    var _api$query$identity;
    return accountId && (_api$query$identity = api.query.identity) != null && _api$query$identity.identityOf ? combineLatest([api.query.identity.identityOf(accountId), api.query.identity.superOf(accountId)]) : of([undefined, undefined]);
  });
}

/**
 * @name identity
 * @description Returns identity info for an account
 */
export function identity(instanceId, api) {
  return memo(instanceId, accountId => api.derive.accounts._identity(accountId).pipe(switchMap(([identityOfOpt, superOfOpt]) => getParent(api, identityOfOpt, superOfOpt)), map(([identityOfOpt, superOf]) => extractIdentity(identityOfOpt, superOf))));
}
export const hasIdentity = firstMemo((api, accountId) => api.derive.accounts.hasIdentityMulti([accountId]));
export function hasIdentityMulti(instanceId, api) {
  return memo(instanceId, accountIds => {
    var _api$query$identity2;
    return (_api$query$identity2 = api.query.identity) != null && _api$query$identity2.identityOf ? combineLatest([api.query.identity.identityOf.multi(accountIds), api.query.identity.superOf.multi(accountIds)]).pipe(map(([identities, supers]) => identities.map((identityOfOpt, index) => {
      const superOfOpt = supers[index];
      const parentId = superOfOpt && superOfOpt.isSome ? superOfOpt.unwrap()[0].toString() : undefined;
      let display;
      if (identityOfOpt && identityOfOpt.isSome) {
        const value = dataAsString(identityOfOpt.unwrap().info.display);
        if (value && !isHex(value)) {
          display = value;
        }
      }
      return {
        display,
        hasIdentity: !!(display || parentId),
        parentId
      };
    }))) : of(accountIds.map(() => ({
      hasIdentity: false
    })));
  });
}
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._identity = _identity;
exports.hasIdentity = void 0;
exports.hasIdentityMulti = hasIdentityMulti;
exports.identity = identity;
var _rxjs = require("rxjs");
var _util = require("@polkadot/util");
var _util2 = require("../util");
// Copyright 2017-2022 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

const UNDEF_HEX = {
  toHex: () => undefined
};
function dataAsString(data) {
  return data.isRaw ? (0, _util.u8aToString)(data.asRaw.toU8a(true)) : data.isNone ? undefined : data.toHex();
}
function extractOther(additional) {
  return additional.reduce((other, _ref) => {
    let [_key, _value] = _ref;
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
    return (0, _rxjs.of)([identityOfOpt, undefined]);
  } else if (superOfOpt != null && superOfOpt.isSome) {
    const superOf = superOfOpt.unwrap();
    return (0, _rxjs.combineLatest)([api.derive.accounts._identity(superOf[0]).pipe((0, _rxjs.map)(_ref2 => {
      let [info] = _ref2;
      return info;
    })), (0, _rxjs.of)(superOf)]);
  }

  // nothing of value returned
  return (0, _rxjs.of)([undefined, undefined]);
}
function _identity(instanceId, api) {
  return (0, _util2.memo)(instanceId, accountId => {
    var _api$query$identity;
    return accountId && (_api$query$identity = api.query.identity) != null && _api$query$identity.identityOf ? (0, _rxjs.combineLatest)([api.query.identity.identityOf(accountId), api.query.identity.superOf(accountId)]) : (0, _rxjs.of)([undefined, undefined]);
  });
}

/**
 * @name identity
 * @description Returns identity info for an account
 */
function identity(instanceId, api) {
  return (0, _util2.memo)(instanceId, accountId => api.derive.accounts._identity(accountId).pipe((0, _rxjs.switchMap)(_ref3 => {
    let [identityOfOpt, superOfOpt] = _ref3;
    return getParent(api, identityOfOpt, superOfOpt);
  }), (0, _rxjs.map)(_ref4 => {
    let [identityOfOpt, superOf] = _ref4;
    return extractIdentity(identityOfOpt, superOf);
  })));
}
const hasIdentity = (0, _util2.firstMemo)((api, accountId) => api.derive.accounts.hasIdentityMulti([accountId]));
exports.hasIdentity = hasIdentity;
function hasIdentityMulti(instanceId, api) {
  return (0, _util2.memo)(instanceId, accountIds => {
    var _api$query$identity2;
    return (_api$query$identity2 = api.query.identity) != null && _api$query$identity2.identityOf ? (0, _rxjs.combineLatest)([api.query.identity.identityOf.multi(accountIds), api.query.identity.superOf.multi(accountIds)]).pipe((0, _rxjs.map)(_ref5 => {
      let [identities, supers] = _ref5;
      return identities.map((identityOfOpt, index) => {
        const superOfOpt = supers[index];
        const parentId = superOfOpt && superOfOpt.isSome ? superOfOpt.unwrap()[0].toString() : undefined;
        let display;
        if (identityOfOpt && identityOfOpt.isSome) {
          const value = dataAsString(identityOfOpt.unwrap().info.display);
          if (value && !(0, _util.isHex)(value)) {
            display = value;
          }
        }
        return {
          display,
          hasIdentity: !!(display || parentId),
          parentId
        };
      });
    })) : (0, _rxjs.of)(accountIds.map(() => ({
      hasIdentity: false
    })));
  });
}
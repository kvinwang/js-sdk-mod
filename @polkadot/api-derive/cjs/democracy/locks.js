"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.locks = locks;
var _rxjs = require("rxjs");
var _util = require("@polkadot/util");
var _util2 = require("../util");
// Copyright 2017-2022 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

const LOCKUPS = [0, 1, 2, 4, 8, 16, 32];
function parseEnd(api, vote, _ref) {
  let {
    approved,
    end
  } = _ref;
  return [end, approved.isTrue && vote.isAye || approved.isFalse && vote.isNay ? end.add((api.consts.democracy.voteLockingPeriod || api.consts.democracy.enactmentPeriod).muln(LOCKUPS[vote.conviction.index])) : _util.BN_ZERO];
}
function parseLock(api, _ref2, referendum) {
  let [referendumId, accountVote] = _ref2;
  const {
    balance,
    vote
  } = accountVote.asStandard;
  const [referendumEnd, unlockAt] = referendum.isFinished ? parseEnd(api, vote, referendum.asFinished) : [_util.BN_ZERO, _util.BN_ZERO];
  return {
    balance,
    isDelegated: false,
    isFinished: referendum.isFinished,
    referendumEnd,
    referendumId,
    unlockAt,
    vote
  };
}
function delegateLocks(api, _ref3) {
  let {
    balance,
    conviction,
    target
  } = _ref3;
  return api.derive.democracy.locks(target).pipe((0, _rxjs.map)(available => available.map(_ref4 => {
    let {
      isFinished,
      referendumEnd,
      referendumId,
      unlockAt,
      vote
    } = _ref4;
    return {
      balance,
      isDelegated: true,
      isFinished,
      referendumEnd,
      referendumId,
      unlockAt: unlockAt.isZero() ? unlockAt : referendumEnd.add((api.consts.democracy.voteLockingPeriod || api.consts.democracy.enactmentPeriod).muln(LOCKUPS[conviction.index])),
      vote: api.registry.createType('Vote', {
        aye: vote.isAye,
        conviction
      })
    };
  })));
}
function directLocks(api, _ref5) {
  let {
    votes
  } = _ref5;
  if (!votes.length) {
    return (0, _rxjs.of)([]);
  }
  return api.query.democracy.referendumInfoOf.multi(votes.map(_ref6 => {
    let [referendumId] = _ref6;
    return referendumId;
  })).pipe((0, _rxjs.map)(referendums => votes.map((vote, index) => [vote, referendums[index].unwrapOr(null)]).filter(item => !!item[1] && (0, _util.isUndefined)(item[1].end) && item[0][1].isStandard).map(_ref7 => {
    let [directVote, referendum] = _ref7;
    return parseLock(api, directVote, referendum);
  })));
}
function locks(instanceId, api) {
  return (0, _util2.memo)(instanceId, accountId => api.query.democracy.votingOf ? api.query.democracy.votingOf(accountId).pipe((0, _rxjs.switchMap)(voting => voting.isDirect ? directLocks(api, voting.asDirect) : voting.isDelegating ? delegateLocks(api, voting.asDelegating) : (0, _rxjs.of)([]))) : (0, _rxjs.of)([]));
}
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calcPassing = calcPassing;
exports.calcVotes = calcVotes;
exports.compareRationals = compareRationals;
exports.getImageHash = getImageHash;
exports.getImageHashBounded = getImageHashBounded;
exports.getStatus = getStatus;
var _util = require("@polkadot/util");
// Copyright 2017-2022 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

function isOldInfo(info) {
  return !!info.proposalHash;
}
function isCurrentStatus(status) {
  return !!status.tally;
}
function compareRationals(n1, d1, n2, d2) {
  while (true) {
    const q1 = n1.div(d1);
    const q2 = n2.div(d2);
    if (q1.lt(q2)) {
      return true;
    } else if (q2.lt(q1)) {
      return false;
    }
    const r1 = n1.mod(d1);
    const r2 = n2.mod(d2);
    if (r2.isZero()) {
      return false;
    } else if (r1.isZero()) {
      return true;
    }
    n1 = d2;
    n2 = d1;
    d1 = r2;
    d2 = r1;
  }
}
function calcPassingOther(threshold, sqrtElectorate, _ref) {
  let {
    votedAye,
    votedNay,
    votedTotal
  } = _ref;
  const sqrtVoters = (0, _util.bnSqrt)(votedTotal);
  return sqrtVoters.isZero() ? false : threshold.isSuperMajorityApprove ? compareRationals(votedNay, sqrtVoters, votedAye, sqrtElectorate) : compareRationals(votedNay, sqrtElectorate, votedAye, sqrtVoters);
}
function calcPassing(threshold, sqrtElectorate, state) {
  return threshold.isSimpleMajority ? state.votedAye.gt(state.votedNay) : calcPassingOther(threshold, sqrtElectorate, state);
}
function calcVotesPrev(votesFor) {
  return votesFor.reduce((state, derived) => {
    const {
      balance,
      vote
    } = derived;
    const isDefault = vote.conviction.index === 0;
    const counted = balance.muln(isDefault ? 1 : vote.conviction.index).divn(isDefault ? 10 : 1);
    if (vote.isAye) {
      state.allAye.push(derived);
      state.voteCountAye++;
      state.votedAye.iadd(counted);
    } else {
      state.allNay.push(derived);
      state.voteCountNay++;
      state.votedNay.iadd(counted);
    }
    state.voteCount++;
    state.votedTotal.iadd(counted);
    return state;
  }, {
    allAye: [],
    allNay: [],
    voteCount: 0,
    voteCountAye: 0,
    voteCountNay: 0,
    votedAye: new _util.BN(0),
    votedNay: new _util.BN(0),
    votedTotal: new _util.BN(0)
  });
}
function calcVotesCurrent(tally, votes) {
  const allAye = [];
  const allNay = [];
  votes.forEach(derived => {
    if (derived.vote.isAye) {
      allAye.push(derived);
    } else {
      allNay.push(derived);
    }
  });
  return {
    allAye,
    allNay,
    voteCount: allAye.length + allNay.length,
    voteCountAye: allAye.length,
    voteCountNay: allNay.length,
    votedAye: tally.ayes,
    votedNay: tally.nays,
    votedTotal: tally.turnout
  };
}
function calcVotes(sqrtElectorate, referendum, votes) {
  const state = isCurrentStatus(referendum.status) ? calcVotesCurrent(referendum.status.tally, votes) : calcVotesPrev(votes);
  return (0, _util.objectSpread)({}, state, {
    isPassing: calcPassing(referendum.status.threshold, sqrtElectorate, state),
    votes
  });
}
function getStatus(info) {
  if (info.isNone) {
    return null;
  }
  const unwrapped = info.unwrap();
  return isOldInfo(unwrapped) ? unwrapped : unwrapped.isOngoing ? unwrapped.asOngoing
  // done, we don't include it here... only currently active
  : null;
}
function getImageHashBounded(hash) {
  return hash.isLegacy ? hash.asLegacy.hash_.toHex() : hash.isLookup ? hash.asLookup.hash_.toHex()
  // for inline, use the actual Bytes hash
  : hash.isInline ? hash.asInline.hash.toHex() : hash.toHex();
}
function getImageHash(status) {
  return getImageHashBounded(status.proposal || status.proposalHash);
}
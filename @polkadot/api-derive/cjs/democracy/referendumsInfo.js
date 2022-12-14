"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._referendumInfo = _referendumInfo;
exports._referendumVotes = _referendumVotes;
exports._referendumsVotes = _referendumsVotes;
exports.referendumsInfo = referendumsInfo;
var _rxjs = require("rxjs");
var _util = require("@polkadot/util");
var _util2 = require("../util");
var _util3 = require("./util");
// Copyright 2017-2022 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

function votesPrev(api, referendumId) {
  return api.query.democracy.votersFor(referendumId).pipe((0, _rxjs.switchMap)(votersFor => (0, _rxjs.combineLatest)([(0, _rxjs.of)(votersFor), votersFor.length ? api.query.democracy.voteOf.multi(votersFor.map(accountId => [referendumId, accountId])) : (0, _rxjs.of)([]), api.derive.balances.votingBalances(votersFor)])), (0, _rxjs.map)(_ref => {
    let [votersFor, votes, balances] = _ref;
    return votersFor.map((accountId, index) => ({
      accountId,
      balance: balances[index].votingBalance || api.registry.createType('Balance'),
      isDelegating: false,
      vote: votes[index] || api.registry.createType('Vote')
    }));
  }));
}
function extractVotes(mapped, referendumId) {
  return mapped.filter(_ref2 => {
    let [, voting] = _ref2;
    return voting.isDirect;
  }).map(_ref3 => {
    let [accountId, voting] = _ref3;
    return [accountId, voting.asDirect.votes.filter(_ref4 => {
      let [idx] = _ref4;
      return idx.eq(referendumId);
    })];
  }).filter(_ref5 => {
    let [, directVotes] = _ref5;
    return !!directVotes.length;
  }).reduce((result, _ref6) => {
    let [accountId, votes] = _ref6;
    return (
      // FIXME We are ignoring split votes
      votes.reduce((result, _ref7) => {
        let [, vote] = _ref7;
        if (vote.isStandard) {
          result.push((0, _util.objectSpread)({
            accountId,
            isDelegating: false
          }, vote.asStandard));
        }
        return result;
      }, result)
    );
  }, []);
}
function votesCurr(api, referendumId) {
  return api.query.democracy.votingOf.entries().pipe((0, _rxjs.map)(allVoting => {
    const mapped = allVoting.map(_ref8 => {
      let [{
        args: [accountId]
      }, voting] = _ref8;
      return [accountId, voting];
    });
    const votes = extractVotes(mapped, referendumId);
    const delegations = mapped.filter(_ref9 => {
      let [, voting] = _ref9;
      return voting.isDelegating;
    }).map(_ref10 => {
      let [accountId, voting] = _ref10;
      return [accountId, voting.asDelegating];
    });

    // add delegations
    delegations.forEach(_ref11 => {
      let [accountId, {
        balance,
        conviction,
        target
      }] = _ref11;
      // Are we delegating to a delegator
      const toDelegator = delegations.find(_ref12 => {
        let [accountId] = _ref12;
        return accountId.eq(target);
      });
      const to = votes.find(_ref13 => {
        let {
          accountId
        } = _ref13;
        return accountId.eq(toDelegator ? toDelegator[0] : target);
      });

      // this delegation has a target
      if (to) {
        votes.push({
          accountId,
          balance,
          isDelegating: true,
          vote: api.registry.createType('Vote', {
            aye: to.vote.isAye,
            conviction
          })
        });
      }
    });
    return votes;
  }));
}
function _referendumVotes(instanceId, api) {
  return (0, _util2.memo)(instanceId, referendum => (0, _rxjs.combineLatest)([api.derive.democracy.sqrtElectorate(), (0, _util.isFunction)(api.query.democracy.votingOf) ? votesCurr(api, referendum.index) : votesPrev(api, referendum.index)]).pipe((0, _rxjs.map)(_ref14 => {
    let [sqrtElectorate, votes] = _ref14;
    return (0, _util3.calcVotes)(sqrtElectorate, referendum, votes);
  })));
}
function _referendumsVotes(instanceId, api) {
  return (0, _util2.memo)(instanceId, referendums => referendums.length ? (0, _rxjs.combineLatest)(referendums.map(referendum => api.derive.democracy._referendumVotes(referendum))) : (0, _rxjs.of)([]));
}
function _referendumInfo(instanceId, api) {
  return (0, _util2.memo)(instanceId, (index, info) => {
    const status = (0, _util3.getStatus)(info);
    return status ? api.derive.democracy.preimage(status.proposal || status.proposalHash).pipe((0, _rxjs.map)(image => ({
      image,
      imageHash: (0, _util3.getImageHash)(status),
      index: api.registry.createType('ReferendumIndex', index),
      status
    }))) : (0, _rxjs.of)(null);
  });
}
function referendumsInfo(instanceId, api) {
  return (0, _util2.memo)(instanceId, ids => ids.length ? api.query.democracy.referendumInfoOf.multi(ids).pipe((0, _rxjs.switchMap)(infos => (0, _rxjs.combineLatest)(ids.map((id, index) => api.derive.democracy._referendumInfo(id, infos[index])))), (0, _rxjs.map)(infos => infos.filter(r => !!r))) : (0, _rxjs.of)([]));
}
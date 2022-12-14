// Copyright 2017-2022 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { combineLatest, map, of, switchMap } from 'rxjs';
import { isFunction, objectSpread } from '@polkadot/util';
import { memo } from "../util/index.js";
import { calcVotes, getImageHash, getStatus } from "./util.js";
function votesPrev(api, referendumId) {
  return api.query.democracy.votersFor(referendumId).pipe(switchMap(votersFor => combineLatest([of(votersFor), votersFor.length ? api.query.democracy.voteOf.multi(votersFor.map(accountId => [referendumId, accountId])) : of([]), api.derive.balances.votingBalances(votersFor)])), map(([votersFor, votes, balances]) => votersFor.map((accountId, index) => ({
    accountId,
    balance: balances[index].votingBalance || api.registry.createType('Balance'),
    isDelegating: false,
    vote: votes[index] || api.registry.createType('Vote')
  }))));
}
function extractVotes(mapped, referendumId) {
  return mapped.filter(([, voting]) => voting.isDirect).map(([accountId, voting]) => [accountId, voting.asDirect.votes.filter(([idx]) => idx.eq(referendumId))]).filter(([, directVotes]) => !!directVotes.length).reduce((result, [accountId, votes]) =>
  // FIXME We are ignoring split votes
  votes.reduce((result, [, vote]) => {
    if (vote.isStandard) {
      result.push(objectSpread({
        accountId,
        isDelegating: false
      }, vote.asStandard));
    }
    return result;
  }, result), []);
}
function votesCurr(api, referendumId) {
  return api.query.democracy.votingOf.entries().pipe(map(allVoting => {
    const mapped = allVoting.map(([{
      args: [accountId]
    }, voting]) => [accountId, voting]);
    const votes = extractVotes(mapped, referendumId);
    const delegations = mapped.filter(([, voting]) => voting.isDelegating).map(([accountId, voting]) => [accountId, voting.asDelegating]);

    // add delegations
    delegations.forEach(([accountId, {
      balance,
      conviction,
      target
    }]) => {
      // Are we delegating to a delegator
      const toDelegator = delegations.find(([accountId]) => accountId.eq(target));
      const to = votes.find(({
        accountId
      }) => accountId.eq(toDelegator ? toDelegator[0] : target));

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
export function _referendumVotes(instanceId, api) {
  return memo(instanceId, referendum => combineLatest([api.derive.democracy.sqrtElectorate(), isFunction(api.query.democracy.votingOf) ? votesCurr(api, referendum.index) : votesPrev(api, referendum.index)]).pipe(map(([sqrtElectorate, votes]) => calcVotes(sqrtElectorate, referendum, votes))));
}
export function _referendumsVotes(instanceId, api) {
  return memo(instanceId, referendums => referendums.length ? combineLatest(referendums.map(referendum => api.derive.democracy._referendumVotes(referendum))) : of([]));
}
export function _referendumInfo(instanceId, api) {
  return memo(instanceId, (index, info) => {
    const status = getStatus(info);
    return status ? api.derive.democracy.preimage(status.proposal || status.proposalHash).pipe(map(image => ({
      image,
      imageHash: getImageHash(status),
      index: api.registry.createType('ReferendumIndex', index),
      status
    }))) : of(null);
  });
}
export function referendumsInfo(instanceId, api) {
  return memo(instanceId, ids => ids.length ? api.query.democracy.referendumInfoOf.multi(ids).pipe(switchMap(infos => combineLatest(ids.map((id, index) => api.derive.democracy._referendumInfo(id, infos[index])))), map(infos => infos.filter(r => !!r))) : of([]));
}
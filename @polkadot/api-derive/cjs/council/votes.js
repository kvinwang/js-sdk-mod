"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.votes = votes;
var _rxjs = require("rxjs");
var _util = require("../util");
// Copyright 2017-2022 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

function isVoter(value) {
  return !Array.isArray(value);
}
function retrieveStakeOf(elections) {
  return elections.stakeOf.entries().pipe((0, _rxjs.map)(entries => entries.map(_ref => {
    let [{
      args: [accountId]
    }, stake] = _ref;
    return [accountId, stake];
  })));
}
function retrieveVoteOf(elections) {
  return elections.votesOf.entries().pipe((0, _rxjs.map)(entries => entries.map(_ref2 => {
    let [{
      args: [accountId]
    }, votes] = _ref2;
    return [accountId, votes];
  })));
}
function retrievePrev(api, elections) {
  return (0, _rxjs.combineLatest)([retrieveStakeOf(elections), retrieveVoteOf(elections)]).pipe((0, _rxjs.map)(_ref3 => {
    let [stakes, votes] = _ref3;
    const result = [];
    votes.forEach(_ref4 => {
      let [voter, votes] = _ref4;
      result.push([voter, {
        stake: api.registry.createType('Balance'),
        votes
      }]);
    });
    stakes.forEach(_ref5 => {
      let [staker, stake] = _ref5;
      const entry = result.find(_ref6 => {
        let [voter] = _ref6;
        return voter.eq(staker);
      });
      if (entry) {
        entry[1].stake = stake;
      } else {
        result.push([staker, {
          stake,
          votes: []
        }]);
      }
    });
    return result;
  }));
}
function retrieveCurrent(elections) {
  return elections.voting.entries().pipe((0, _rxjs.map)(entries => entries.map(_ref7 => {
    let [{
      args: [accountId]
    }, value] = _ref7;
    return [accountId, isVoter(value) ? {
      stake: value.stake,
      votes: value.votes
    } : {
      stake: value[0],
      votes: value[1]
    }];
  })));
}
function votes(instanceId, api) {
  const elections = api.query.phragmenElection || api.query.electionsPhragmen || api.query.elections;
  return (0, _util.memo)(instanceId, () => elections ? elections.stakeOf ? retrievePrev(api, elections) : retrieveCurrent(elections) : (0, _rxjs.of)([]));
}
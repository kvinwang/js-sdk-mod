"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bounties = bounties;
var _rxjs = require("rxjs");
var _util = require("../util");
var _filterBountyProposals = require("./helpers/filterBountyProposals");
// Copyright 2017-2022 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

function parseResult(_ref) {
  let [maybeBounties, maybeDescriptions, ids, bountyProposals] = _ref;
  const bounties = [];
  maybeBounties.forEach((bounty, index) => {
    if (bounty.isSome) {
      bounties.push({
        bounty: bounty.unwrap(),
        description: maybeDescriptions[index].unwrapOrDefault().toUtf8(),
        index: ids[index],
        proposals: bountyProposals.filter(bountyProposal => bountyProposal.proposal && ids[index].eq(bountyProposal.proposal.args[0]))
      });
    }
  });
  return bounties;
}
function bounties(instanceId, api) {
  const bountyBase = api.query.bounties || api.query.treasury;
  return (0, _util.memo)(instanceId, () => bountyBase.bounties ? (0, _rxjs.combineLatest)([bountyBase.bountyCount(), api.query.council ? api.query.council.proposalCount() : (0, _rxjs.of)(0)]).pipe((0, _rxjs.switchMap)(() => (0, _rxjs.combineLatest)([bountyBase.bounties.keys(), api.derive.council ? api.derive.council.proposals() : (0, _rxjs.of)([])])), (0, _rxjs.switchMap)(_ref2 => {
    let [keys, proposals] = _ref2;
    const ids = keys.map(_ref3 => {
      let {
        args: [id]
      } = _ref3;
      return id;
    });
    return (0, _rxjs.combineLatest)([bountyBase.bounties.multi(ids), bountyBase.bountyDescriptions.multi(ids), (0, _rxjs.of)(ids), (0, _rxjs.of)((0, _filterBountyProposals.filterBountiesProposals)(api, proposals))]);
  }), (0, _rxjs.map)(parseResult)) : (0, _rxjs.of)(parseResult([[], [], [], []])));
}
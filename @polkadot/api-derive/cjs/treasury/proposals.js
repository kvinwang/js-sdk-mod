"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.proposals = proposals;
var _rxjs = require("rxjs");
var _util = require("../util");
// Copyright 2017-2022 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

function parseResult(api, _ref) {
  let {
    allIds,
    allProposals,
    approvalIds,
    councilProposals,
    proposalCount
  } = _ref;
  const approvals = [];
  const proposals = [];
  const councilTreasury = councilProposals.filter(_ref2 => {
    let {
      proposal
    } = _ref2;
    return proposal && (api.tx.treasury.approveProposal.is(proposal) || api.tx.treasury.rejectProposal.is(proposal));
  });
  allIds.forEach((id, index) => {
    if (allProposals[index].isSome) {
      const council = councilTreasury.filter(_ref3 => {
        let {
          proposal
        } = _ref3;
        return proposal && id.eq(proposal.args[0]);
      }).sort((a, b) => a.proposal && b.proposal ? a.proposal.method.localeCompare(b.proposal.method) : a.proposal ? -1 : 1);
      const isApproval = approvalIds.some(approvalId => approvalId.eq(id));
      const derived = {
        council,
        id,
        proposal: allProposals[index].unwrap()
      };
      if (isApproval) {
        approvals.push(derived);
      } else {
        proposals.push(derived);
      }
    }
  });
  return {
    approvals,
    proposalCount,
    proposals
  };
}
function retrieveProposals(api, proposalCount, approvalIds) {
  const proposalIds = [];
  const count = proposalCount.toNumber();
  for (let index = 0; index < count; index++) {
    if (!approvalIds.some(id => id.eqn(index))) {
      proposalIds.push(api.registry.createType('ProposalIndex', index));
    }
  }
  const allIds = [...proposalIds, ...approvalIds];
  return (0, _rxjs.combineLatest)([api.query.treasury.proposals.multi(allIds), api.derive.council ? api.derive.council.proposals() : (0, _rxjs.of)([])]).pipe((0, _rxjs.map)(_ref4 => {
    let [allProposals, councilProposals] = _ref4;
    return parseResult(api, {
      allIds,
      allProposals,
      approvalIds,
      councilProposals,
      proposalCount
    });
  }));
}

/**
 * @description Retrieve all active and approved treasury proposals, along with their info
 */
function proposals(instanceId, api) {
  return (0, _util.memo)(instanceId, () => api.query.treasury ? (0, _rxjs.combineLatest)([api.query.treasury.proposalCount(), api.query.treasury.approvals()]).pipe((0, _rxjs.switchMap)(_ref5 => {
    let [proposalCount, approvalIds] = _ref5;
    return retrieveProposals(api, proposalCount, approvalIds);
  })) : (0, _rxjs.of)({
    approvals: [],
    proposalCount: api.registry.createType('ProposalIndex'),
    proposals: []
  }));
}
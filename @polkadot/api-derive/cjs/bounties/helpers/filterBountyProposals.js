"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.filterBountiesProposals = filterBountiesProposals;
// Copyright 2017-2022 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

function filterBountiesProposals(api, allProposals) {
  const bountyTxBase = api.tx.bounties ? api.tx.bounties : api.tx.treasury;
  const bountyProposalCalls = [bountyTxBase.approveBounty, bountyTxBase.closeBounty, bountyTxBase.proposeCurator, bountyTxBase.unassignCurator];
  return allProposals.filter(proposal => bountyProposalCalls.find(bountyCall => proposal.proposal && bountyCall.is(proposal.proposal)));
}
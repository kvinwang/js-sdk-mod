// Copyright 2017-2022 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { catchError, combineLatest, map, of, switchMap } from 'rxjs';
import { isFunction } from '@polkadot/util';
import { firstObservable } from "../util/index.js";
import { callMethod, withSection } from "./helpers.js";

// We are re-exporting these from here to ensure that *.d.ts generation is correct

function parse(api, [hashes, proposals, votes]) {
  return proposals.map((o, index) => ({
    hash: api.registry.createType('Hash', hashes[index]),
    proposal: o && o.isSome ? o.unwrap() : null,
    votes: votes[index].unwrapOr(null)
  }));
}
function _proposalsFrom(api, query, hashes) {
  return (isFunction(query == null ? void 0 : query.proposals) && hashes.length ? combineLatest([of(hashes),
  // this should simply be api.query[section].proposalOf.multi<Option<Proposal>>(hashes),
  // however we have had cases on Edgeware where the indices have moved around after an
  // upgrade, which results in invalid on-chain data
  query.proposalOf.multi(hashes).pipe(catchError(() => of(hashes.map(() => null)))), query.voting.multi(hashes)]) : of([[], [], []])).pipe(map(r => parse(api, r)));
}
export function hasProposals(section) {
  return withSection(section, query => () => of(isFunction(query == null ? void 0 : query.proposals)));
}
export function proposals(section) {
  return withSection(section, (query, api) => () => api.derive[section].proposalHashes().pipe(switchMap(all => _proposalsFrom(api, query, all))));
}
export function proposal(section) {
  return withSection(section, (query, api) => hash => isFunction(query == null ? void 0 : query.proposals) ? firstObservable(_proposalsFrom(api, query, [hash])) : of(null));
}
export const proposalCount = callMethod('proposalCount', null);
export const proposalHashes = callMethod('proposals', []);
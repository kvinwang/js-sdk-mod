// Copyright 2017-2022 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { combineLatest, map, of } from 'rxjs';
import { objectSpread } from '@polkadot/util';
import { memo } from "../util/index.js";

// SeatHolder is current tuple is 2.x-era Substrate

function isSeatHolder(value) {
  return !Array.isArray(value);
}
function isCandidateTuple(value) {
  return Array.isArray(value);
}
function getAccountTuple(value) {
  return isSeatHolder(value) ? [value.who, value.stake] : value;
}
function getCandidate(value) {
  return isCandidateTuple(value) ? value[0] : value;
}
function sortAccounts([, balanceA], [, balanceB]) {
  return balanceB.cmp(balanceA);
}
function getConstants(api, elections) {
  return elections ? {
    candidacyBond: api.consts[elections].candidacyBond,
    desiredRunnersUp: api.consts[elections].desiredRunnersUp,
    desiredSeats: api.consts[elections].desiredMembers,
    termDuration: api.consts[elections].termDuration,
    votingBond: api.consts[elections].votingBond
  } : {};
}
function getModules(api) {
  const [council] = api.registry.getModuleInstances(api.runtimeVersion.specName, 'council') || ['council'];
  const elections = api.query.phragmenElection ? 'phragmenElection' : api.query.electionsPhragmen ? 'electionsPhragmen' : api.query.elections ? 'elections' : null;
  return [council, elections];
}
function queryAll(api, council, elections) {
  return api.queryMulti([api.query[council].members, api.query[elections].candidates, api.query[elections].members, api.query[elections].runnersUp]);
}
function queryCouncil(api, council) {
  return combineLatest([api.query[council].members(), of([]), of([]), of([])]);
}

/**
 * @name info
 * @returns An object containing the combined results of the storage queries for
 * all relevant election module properties.
 * @example
 * <BR>
 *
 * ```javascript
 * api.derive.elections.info(({ members, candidates }) => {
 *   console.log(`There are currently ${members.length} council members and ${candidates.length} prospective council candidates.`);
 * });
 * ```
 */
export function info(instanceId, api) {
  return memo(instanceId, () => {
    const [council, elections] = getModules(api);
    return (elections ? queryAll(api, council, elections) : queryCouncil(api, council)).pipe(map(([councilMembers, candidates, members, runnersUp]) => objectSpread({}, getConstants(api, elections), {
      candidateCount: api.registry.createType('u32', candidates.length),
      candidates: candidates.map(getCandidate),
      members: members.length ? members.map(getAccountTuple).sort(sortAccounts) : councilMembers.map(a => [a, api.registry.createType('Balance')]),
      runnersUp: runnersUp.map(getAccountTuple).sort(sortAccounts)
    })));
  });
}
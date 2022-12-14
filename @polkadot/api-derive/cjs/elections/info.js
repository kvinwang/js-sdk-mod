"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.info = info;
var _rxjs = require("rxjs");
var _util = require("@polkadot/util");
var _util2 = require("../util");
// Copyright 2017-2022 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

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
function sortAccounts(_ref, _ref2) {
  let [, balanceA] = _ref;
  let [, balanceB] = _ref2;
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
  return (0, _rxjs.combineLatest)([api.query[council].members(), (0, _rxjs.of)([]), (0, _rxjs.of)([]), (0, _rxjs.of)([])]);
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
function info(instanceId, api) {
  return (0, _util2.memo)(instanceId, () => {
    const [council, elections] = getModules(api);
    return (elections ? queryAll(api, council, elections) : queryCouncil(api, council)).pipe((0, _rxjs.map)(_ref3 => {
      let [councilMembers, candidates, members, runnersUp] = _ref3;
      return (0, _util.objectSpread)({}, getConstants(api, elections), {
        candidateCount: api.registry.createType('u32', candidates.length),
        candidates: candidates.map(getCandidate),
        members: members.length ? members.map(getAccountTuple).sort(sortAccounts) : councilMembers.map(a => [a, api.registry.createType('Balance')]),
        runnersUp: runnersUp.map(getAccountTuple).sort(sortAccounts)
      });
    }));
  });
}
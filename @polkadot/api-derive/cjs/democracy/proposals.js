"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.proposals = proposals;
var _rxjs = require("rxjs");
var _util = require("@polkadot/util");
var _util2 = require("../util");
var _util3 = require("./util");
// Copyright 2017-2022 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

function isNewDepositors(depositors) {
  // Detect balance...
  // eslint-disable-next-line @typescript-eslint/unbound-method
  return (0, _util.isFunction)(depositors[1].mul);
}
function parse(_ref) {
  let [proposals, images, optDepositors] = _ref;
  return proposals.filter((_ref2, index) => {
    var _optDepositors$index;
    let [,, proposer] = _ref2;
    return !!((_optDepositors$index = optDepositors[index]) != null && _optDepositors$index.isSome) && !proposer.isEmpty;
  }).map((_ref3, proposalIndex) => {
    let [index, hash, proposer] = _ref3;
    const depositors = optDepositors[proposalIndex].unwrap();
    return (0, _util.objectSpread)({
      image: images[proposalIndex],
      imageHash: (0, _util3.getImageHashBounded)(hash),
      index,
      proposer
    }, isNewDepositors(depositors) ? {
      balance: depositors[1],
      seconds: depositors[0]
    } : {
      balance: depositors[0],
      seconds: depositors[1]
    });
  });
}
function proposals(instanceId, api) {
  return (0, _util2.memo)(instanceId, () => {
    var _api$query$democracy, _api$query$democracy2;
    return (0, _util.isFunction)((_api$query$democracy = api.query.democracy) == null ? void 0 : _api$query$democracy.publicProps) && (0, _util.isFunction)((_api$query$democracy2 = api.query.democracy) == null ? void 0 : _api$query$democracy2.preimages) ? api.query.democracy.publicProps().pipe((0, _rxjs.switchMap)(proposals => proposals.length ? (0, _rxjs.combineLatest)([(0, _rxjs.of)(proposals), api.derive.democracy.preimages(proposals.map(_ref4 => {
      let [, hash] = _ref4;
      return hash;
    })), api.query.democracy.depositOf.multi(proposals.map(_ref5 => {
      let [index] = _ref5;
      return index;
    }))]) : (0, _rxjs.of)([[], [], []])), (0, _rxjs.map)(parse)) : (0, _rxjs.of)([]);
  });
}
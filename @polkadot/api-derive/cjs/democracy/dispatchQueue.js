"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dispatchQueue = dispatchQueue;
var _rxjs = require("rxjs");
var _types = require("@polkadot/types");
var _util = require("@polkadot/util");
var _util2 = require("../util");
var _util3 = require("./util");
// Copyright 2017-2022 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

const DEMOCRACY_ID = (0, _util.stringToHex)('democrac');

// included here for backwards compat

function isMaybeHashedOrBounded(call) {
  // check for enum
  return call instanceof _types.Enum;
}
function isBounded(call) {
  // check for type
  return call.isInline || call.isLegacy || call.isLookup;
}
function queryQueue(api) {
  return api.query.democracy.dispatchQueue().pipe((0, _rxjs.switchMap)(dispatches => (0, _rxjs.combineLatest)([(0, _rxjs.of)(dispatches), api.derive.democracy.preimages(dispatches.map(_ref => {
    let [, hash] = _ref;
    return hash;
  }))])), (0, _rxjs.map)(_ref2 => {
    let [dispatches, images] = _ref2;
    return dispatches.map((_ref3, dispatchIndex) => {
      let [at, imageHash, index] = _ref3;
      return {
        at,
        image: images[dispatchIndex],
        imageHash: (0, _util3.getImageHashBounded)(imageHash),
        index
      };
    });
  }));
}
function schedulerEntries(api) {
  // We don't get entries, but rather we get the keys (triggered via finished referendums) and
  // the subscribe to those keys - this means we pickup when the schedulers actually executes
  // at a block, the entry for that block will become empty
  return api.derive.democracy.referendumsFinished().pipe((0, _rxjs.switchMap)(() => api.query.scheduler.agenda.keys()), (0, _rxjs.switchMap)(keys => {
    const blockNumbers = keys.map(_ref4 => {
      let {
        args: [blockNumber]
      } = _ref4;
      return blockNumber;
    });
    return blockNumbers.length ? (0, _rxjs.combineLatest)([(0, _rxjs.of)(blockNumbers),
    // this should simply be api.query.scheduler.agenda.multi,
    // however we have had cases on Darwinia where the indices have moved around after an
    // upgrade, which results in invalid on-chain data
    api.query.scheduler.agenda.multi(blockNumbers).pipe((0, _rxjs.catchError)(() => (0, _rxjs.of)(blockNumbers.map(() => []))))]) : (0, _rxjs.of)([[], []]);
  }));
}
function queryScheduler(api) {
  return schedulerEntries(api).pipe((0, _rxjs.switchMap)(_ref5 => {
    let [blockNumbers, agendas] = _ref5;
    const result = [];
    blockNumbers.forEach((at, index) => {
      (agendas[index] || []).filter(o => o.isSome).forEach(o => {
        const scheduled = o.unwrap();
        if (scheduled.maybeId.isSome) {
          const id = scheduled.maybeId.unwrap().toHex();
          if (id.startsWith(DEMOCRACY_ID)) {
            const imageHash = isMaybeHashedOrBounded(scheduled.call) ? isBounded(scheduled.call) ? (0, _util3.getImageHashBounded)(scheduled.call) : scheduled.call.isHash ? scheduled.call.asHash.toHex() : scheduled.call.asValue.args[0].toHex() : scheduled.call.args[0].toHex();
            result.push({
              at,
              imageHash,
              index: api.registry.createType('(u64, ReferendumIndex)', id)[1]
            });
          }
        }
      });
    });
    return (0, _rxjs.combineLatest)([(0, _rxjs.of)(result), result.length ? api.derive.democracy.preimages(result.map(_ref6 => {
      let {
        imageHash
      } = _ref6;
      return imageHash;
    })) : (0, _rxjs.of)([])]);
  }), (0, _rxjs.map)(_ref7 => {
    let [infos, images] = _ref7;
    return infos.map((info, index) => (0, _util.objectSpread)({
      image: images[index]
    }, info));
  }));
}
function dispatchQueue(instanceId, api) {
  return (0, _util2.memo)(instanceId, () => {
    var _api$query$scheduler;
    return (0, _util.isFunction)((_api$query$scheduler = api.query.scheduler) == null ? void 0 : _api$query$scheduler.agenda) ? queryScheduler(api) : api.query.democracy.dispatchQueue ? queryQueue(api) : (0, _rxjs.of)([]);
  });
}
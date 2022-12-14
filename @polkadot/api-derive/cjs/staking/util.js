"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.combineEras = combineEras;
exports.erasHistoricApply = erasHistoricApply;
exports.erasHistoricApplyAccount = erasHistoricApplyAccount;
exports.filterEras = filterEras;
exports.singleEra = singleEra;
var _rxjs = require("rxjs");
var _util = require("@polkadot/util");
var _util2 = require("../util");
// Copyright 2017-2022 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

// only retrieve a maximum of 14 eras (84 / 6) at a time
// (This is not empirically calculated. Rather smaller sizes take longer
// time due to the serial nature, large sizes may tie up the RPCs)
const ERA_CHUNK_SIZE = 14;
function chunkEras(eras, fn) {
  const chunked = (0, _util.arrayChunk)(eras, ERA_CHUNK_SIZE);
  let index = 0;
  const subject = new _rxjs.BehaviorSubject(chunked[index]);
  return subject.pipe((0, _rxjs.switchMap)(fn), (0, _rxjs.tap)(() => {
    (0, _util.nextTick)(() => {
      index++;
      index === chunked.length ? subject.complete() : subject.next(chunked[index]);
    });
  }), (0, _rxjs.toArray)(), (0, _rxjs.map)(_util.arrayFlatten));
}
function filterEras(eras, list) {
  return eras.filter(e => !list.some(_ref => {
    let {
      era
    } = _ref;
    return e.eq(era);
  }));
}
function erasHistoricApply(fn) {
  return (instanceId, api) =>
  // Cannot quite get the typing right, but it is right in the code
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  (0, _util2.memo)(instanceId, function () {
    let withActive = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    return api.derive.staking.erasHistoric(withActive).pipe((0, _rxjs.switchMap)(e => api.derive.staking[fn](e, withActive)));
  });
}
function erasHistoricApplyAccount(fn) {
  return (instanceId, api) =>
  // Cannot quite get the typing right, but it is right in the code
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  (0, _util2.memo)(instanceId, function (accountId) {
    let withActive = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    return api.derive.staking.erasHistoric(withActive).pipe((0, _rxjs.switchMap)(e => api.derive.staking[fn](accountId, e, withActive)));
  });
}
function singleEra(fn) {
  return (instanceId, api) =>
  // Cannot quite get the typing right, but it is right in the code
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  (0, _util2.memo)(instanceId, era => api.derive.staking[fn](era, true));
}
function combineEras(fn) {
  return (instanceId, api) =>
  // Cannot quite get the typing right, but it is right in the code
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  (0, _util2.memo)(instanceId, (eras, withActive) => !eras.length ? (0, _rxjs.of)([]) : chunkEras(eras, eras => (0, _rxjs.combineLatest)(eras.map(e => api.derive.staking[fn](e, withActive)))));
}
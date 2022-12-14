"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.memo = memo;
var _rxjs = require("rxjs");
var _util = require("@polkadot/util");
var _drr = require("./drr");
// Copyright 2017-2022 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

// Wraps a derive, doing 2 things to optimize calls -
//   1. creates a memo of the inner fn -> Observable, removing when unsubscribed
//   2. wraps the observable in a drr() (which includes an unsub delay)
/** @internal */
// eslint-disable-next-line @typescript-eslint/ban-types
function memo(instanceId, inner) {
  const options = {
    getInstanceId: () => instanceId
  };
  const cached = (0, _util.memoize)(function () {
    for (var _len = arguments.length, params = new Array(_len), _key = 0; _key < _len; _key++) {
      params[_key] = arguments[_key];
    }
    return new _rxjs.Observable(observer => {
      const subscription = inner(...params).subscribe(observer);
      return () => {
        cached.unmemoize(...params);
        subscription.unsubscribe();
      };
    }).pipe((0, _drr.drr)());
  }, options);
  return cached;
}
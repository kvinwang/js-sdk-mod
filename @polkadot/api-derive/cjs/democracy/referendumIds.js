"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.referendumIds = referendumIds;
var _rxjs = require("rxjs");
var _util = require("../util");
// Copyright 2017-2022 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

function referendumIds(instanceId, api) {
  return (0, _util.memo)(instanceId, () => {
    var _api$query$democracy;
    return (_api$query$democracy = api.query.democracy) != null && _api$query$democracy.lowestUnbaked ? api.queryMulti([api.query.democracy.lowestUnbaked, api.query.democracy.referendumCount]).pipe((0, _rxjs.map)(_ref => {
      let [first, total] = _ref;
      return total.gt(first)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      ? [...Array(total.sub(first).toNumber())].map((_, i) => first.addn(i)) : [];
    })) : (0, _rxjs.of)([]);
  });
}
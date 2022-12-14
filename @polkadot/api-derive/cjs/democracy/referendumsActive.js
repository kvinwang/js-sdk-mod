"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.referendumsActive = referendumsActive;
var _rxjs = require("rxjs");
var _util = require("../util");
// Copyright 2017-2022 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

function referendumsActive(instanceId, api) {
  return (0, _util.memo)(instanceId, () => api.derive.democracy.referendumIds().pipe((0, _rxjs.switchMap)(ids => ids.length ? api.derive.democracy.referendumsInfo(ids) : (0, _rxjs.of)([]))));
}
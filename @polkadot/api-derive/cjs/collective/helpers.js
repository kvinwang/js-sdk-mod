"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.callMethod = callMethod;
exports.getInstance = getInstance;
exports.withSection = withSection;
var _rxjs = require("rxjs");
var _util = require("@polkadot/util");
var _util2 = require("../util");
// Copyright 2017-2022 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

function getInstance(api, section) {
  const instances = api.registry.getModuleInstances(api.runtimeVersion.specName, section);
  const name = instances && instances.length ? instances[0] : section;
  return api.query[name];
}
function withSection(section, fn) {
  return (instanceId, api) => (0, _util2.memo)(instanceId, fn(getInstance(api, section), api, instanceId));
}
function callMethod(method, empty) {
  return section => withSection(section, query => () => (0, _util.isFunction)(query == null ? void 0 : query[method]) ? query[method]() : (0, _rxjs.of)(empty));
}
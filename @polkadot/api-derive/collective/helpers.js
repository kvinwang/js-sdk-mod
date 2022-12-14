// Copyright 2017-2022 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { of } from 'rxjs';
import { isFunction } from '@polkadot/util';
import { memo } from "../util/index.js";
export function getInstance(api, section) {
  const instances = api.registry.getModuleInstances(api.runtimeVersion.specName, section);
  const name = instances && instances.length ? instances[0] : section;
  return api.query[name];
}
export function withSection(section, fn) {
  return (instanceId, api) => memo(instanceId, fn(getInstance(api, section), api, instanceId));
}
export function callMethod(method, empty) {
  return section => withSection(section, query => () => isFunction(query == null ? void 0 : query[method]) ? query[method]() : of(empty));
}
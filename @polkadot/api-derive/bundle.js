// Copyright 2017-2022 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { derive } from "./derive.js";
import { lazyDeriveSection } from "./util/index.js";
export * from "./derive.js";
export * from "./type/index.js";
export { lazyDeriveSection };

// Enable derive only if some of these modules are available
const checks = {
  allianceMotion: {
    instances: ['allianceMotion'],
    methods: []
  },
  bagsList: {
    instances: ['voterBagsList', 'voterList', 'bagsList'],
    methods: [],
    withDetect: true
  },
  contracts: {
    instances: ['contracts'],
    methods: []
  },
  council: {
    instances: ['council'],
    methods: [],
    withDetect: true
  },
  crowdloan: {
    instances: ['crowdloan'],
    methods: []
  },
  democracy: {
    instances: ['democracy'],
    methods: []
  },
  elections: {
    instances: ['phragmenElection', 'electionsPhragmen', 'elections', 'council'],
    methods: [],
    withDetect: true
  },
  imOnline: {
    instances: ['imOnline'],
    methods: []
  },
  membership: {
    instances: ['membership'],
    methods: []
  },
  parachains: {
    instances: ['parachains', 'registrar'],
    methods: []
  },
  session: {
    instances: ['session'],
    methods: []
  },
  society: {
    instances: ['society'],
    methods: []
  },
  staking: {
    instances: ['staking'],
    methods: ['erasRewardPoints']
  },
  technicalCommittee: {
    instances: ['technicalCommittee'],
    methods: [],
    withDetect: true
  },
  treasury: {
    instances: ['treasury'],
    methods: []
  }
};
function getModuleInstances(api, specName, moduleName) {
  return api.registry.getModuleInstances(specName, moduleName) || [];
}

/**
 * Returns an object that will inject `api` into all the functions inside
 * `allSections`, and keep the object architecture of `allSections`.
 */
/** @internal */
function injectFunctions(instanceId, api, derives) {
  const result = {};
  const names = Object.keys(derives);
  const keys = Object.keys(api.query);
  const specName = api.runtimeVersion.specName;
  const filterKeys = q => keys.includes(q);
  const filterInstances = q => getModuleInstances(api, specName, q).some(filterKeys);
  const filterMethods = all => m => all.some(q => keys.includes(q) && api.query[q][m]);
  const getKeys = s => Object.keys(derives[s]);
  const creator = (s, m) => derives[s][m](instanceId, api);
  const isIncluded = c => !checks[c] || checks[c].instances.some(filterKeys) && (!checks[c].methods.length || checks[c].methods.every(filterMethods(checks[c].instances))) || checks[c].withDetect && checks[c].instances.some(filterInstances);
  for (let i = 0; i < names.length; i++) {
    const name = names[i];
    isIncluded(name) && lazyDeriveSection(result, name, getKeys, creator);
  }
  return result;
}

// FIXME The return type of this function should be {...ExactDerive, ...DeriveCustom}
// For now we just drop the custom derive typings
/** @internal */
export function getAvailableDerives(instanceId, api, custom = {}) {
  return {
    ...injectFunctions(instanceId, api, derive),
    ...injectFunctions(instanceId, api, custom)
  };
}
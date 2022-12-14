"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  getAvailableDerives: true,
  lazyDeriveSection: true
};
exports.getAvailableDerives = getAvailableDerives;
Object.defineProperty(exports, "lazyDeriveSection", {
  enumerable: true,
  get: function () {
    return _util.lazyDeriveSection;
  }
});
var _derive = require("./derive");
Object.keys(_derive).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _derive[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _derive[key];
    }
  });
});
var _util = require("./util");
var _type = require("./type");
Object.keys(_type).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _type[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _type[key];
    }
  });
});
// Copyright 2017-2022 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

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
    isIncluded(name) && (0, _util.lazyDeriveSection)(result, name, getKeys, creator);
  }
  return result;
}

// FIXME The return type of this function should be {...ExactDerive, ...DeriveCustom}
// For now we just drop the custom derive typings
/** @internal */
function getAvailableDerives(instanceId, api) {
  let custom = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return {
    ...injectFunctions(instanceId, api, _derive.derive),
    ...injectFunctions(instanceId, api, custom)
  };
}
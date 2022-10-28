"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetch = void 0;
Object.defineProperty(exports, "packageInfo", {
  enumerable: true,
  get: function () {
    return _packageInfo.packageInfo;
  }
});

var _xGlobal = require("@polkadot/x-global");

var _packageInfo = require("./packageInfo");

// Copyright 2017-2022 @polkadot/x-fetch authors & contributors
// SPDX-License-Identifier: Apache-2.0
// This is an ESM module, use the async import(...) syntax to pull it
// in. Logically we would like it in nodeFetch(...) itself, however
// while it is all-ok on Node itself, it does create issues in Jest,
// possibly due to the Jest 28 need for --experimental-vm-modules
const importFetch = import('node-fetch').catch(() => null); // keep track of the resolved import value

let modFn = null;

async function nodeFetch() {
  if (modFn) {
    return modFn(...arguments);
  }

  const mod = await importFetch;

  if (!mod || !mod.default) {
    throw new Error('Unable to import node-fetch in this environment');
  }

  modFn = mod.default;
  return modFn(...arguments);
}

const fetch = (0, _xGlobal.extractGlobal)('fetch', nodeFetch);
exports.fetch = fetch;
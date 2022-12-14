"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _typesCreate = require("@polkadot/types-create");
var _util = require("@polkadot/util");
// Copyright 2017-2022 @polkadot/types-known authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable sort-keys */

// structs need to be in order
/* eslint-disable sort-keys */

const sharedTypes = {
  DispatchErrorModule: 'DispatchErrorModuleU8',
  FullIdentification: '()',
  // No staking, only session (as per config)
  Keys: 'SessionKeys7B',
  Weight: 'WeightV1'
};
const versioned = [{
  minmax: [0, 200],
  types: (0, _util.objectSpread)({}, sharedTypes, {
    AccountInfo: 'AccountInfoWithDualRefCount',
    Address: 'AccountId',
    LookupSource: 'AccountId'
  })
}, {
  minmax: [201, 214],
  types: (0, _util.objectSpread)({}, sharedTypes, {
    AccountInfo: 'AccountInfoWithDualRefCount'
  })
}, {
  minmax: [215, 228],
  types: (0, _util.objectSpread)({}, sharedTypes, {
    Keys: 'SessionKeys6'
  })
}, {
  minmax: [229, 9099],
  types: (0, _util.objectSpread)({}, sharedTypes, (0, _typesCreate.mapXcmTypes)('V0'))
}, {
  minmax: [9100, 9105],
  types: (0, _util.objectSpread)({}, sharedTypes, (0, _typesCreate.mapXcmTypes)('V1'))
}, {
  // metadata v14
  minmax: [9106, undefined],
  types: {
    Weight: 'WeightV1'
  }
}
// ,
// {
//   // weight v2 introduction
//   minmax: [9300, undefined],
//   types: {
//     Weight: 'WeightV2'
//   }
// }
];
var _default = versioned;
exports.default = _default;
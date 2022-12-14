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

const sharedTypes = {
  // 16 validators
  CompactAssignments: 'CompactAssignmentsWith16',
  DispatchErrorModule: 'DispatchErrorModuleU8',
  RawSolution: 'RawSolutionWith16',
  // general
  Keys: 'SessionKeys6',
  ProxyType: {
    _enum: ['Any', 'NonTransfer', 'Staking', 'SudoBalances', 'IdentityJudgement', 'CancelProxy']
  },
  Weight: 'WeightV1'
};
const addrAccountIdTypes = {
  AccountInfo: 'AccountInfoWithRefCount',
  Address: 'AccountId',
  CompactAssignments: 'CompactAssignmentsWith16',
  DispatchErrorModule: 'DispatchErrorModuleU8',
  LookupSource: 'AccountId',
  Keys: 'SessionKeys5',
  RawSolution: 'RawSolutionWith16',
  ValidatorPrefs: 'ValidatorPrefsWithCommission'
};
const versioned = [{
  minmax: [1, 2],
  types: (0, _util.objectSpread)({}, sharedTypes, addrAccountIdTypes, {
    CompactAssignments: 'CompactAssignmentsTo257',
    DispatchInfo: 'DispatchInfoTo244',
    Heartbeat: 'HeartbeatTo244',
    Multiplier: 'Fixed64',
    OpenTip: 'OpenTipTo225',
    RefCount: 'RefCountTo259',
    Weight: 'u32'
  })
}, {
  minmax: [3, 22],
  types: (0, _util.objectSpread)({}, sharedTypes, addrAccountIdTypes, {
    CompactAssignments: 'CompactAssignmentsTo257',
    DispatchInfo: 'DispatchInfoTo244',
    Heartbeat: 'HeartbeatTo244',
    OpenTip: 'OpenTipTo225',
    RefCount: 'RefCountTo259'
  })
}, {
  minmax: [23, 42],
  types: (0, _util.objectSpread)({}, sharedTypes, addrAccountIdTypes, {
    CompactAssignments: 'CompactAssignmentsTo257',
    DispatchInfo: 'DispatchInfoTo244',
    Heartbeat: 'HeartbeatTo244',
    RefCount: 'RefCountTo259'
  })
}, {
  minmax: [43, 44],
  types: (0, _util.objectSpread)({}, sharedTypes, addrAccountIdTypes, {
    DispatchInfo: 'DispatchInfoTo244',
    Heartbeat: 'HeartbeatTo244',
    RefCount: 'RefCountTo259'
  })
}, {
  minmax: [45, 47],
  types: (0, _util.objectSpread)({}, sharedTypes, addrAccountIdTypes)
}, {
  minmax: [48, 49],
  types: (0, _util.objectSpread)({}, sharedTypes, {
    AccountInfo: 'AccountInfoWithDualRefCount'
  })
}, {
  minmax: [50, 9099],
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
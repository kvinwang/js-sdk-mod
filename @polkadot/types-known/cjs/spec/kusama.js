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
  CompactAssignments: 'CompactAssignmentsWith24',
  DispatchErrorModule: 'DispatchErrorModuleU8',
  RawSolution: 'RawSolutionWith24',
  Keys: 'SessionKeys6',
  ProxyType: {
    _enum: ['Any', 'NonTransfer', 'Governance', 'Staking', 'IdentityJudgement', 'CancelProxy', 'Auction']
  },
  Weight: 'WeightV1'
};
const addrIndicesTypes = {
  AccountInfo: 'AccountInfoWithRefCount',
  Address: 'LookupSource',
  CompactAssignments: 'CompactAssignmentsWith16',
  DispatchErrorModule: 'DispatchErrorModuleU8',
  RawSolution: 'RawSolutionWith16',
  Keys: 'SessionKeys5',
  LookupSource: 'IndicesLookupSource',
  ValidatorPrefs: 'ValidatorPrefsWithCommission'
};
const addrAccountIdTypes = {
  AccountInfo: 'AccountInfoWithRefCount',
  Address: 'AccountId',
  CompactAssignments: 'CompactAssignmentsWith16',
  DispatchErrorModule: 'DispatchErrorModuleU8',
  RawSolution: 'RawSolutionWith16',
  Keys: 'SessionKeys5',
  LookupSource: 'AccountId',
  ValidatorPrefs: 'ValidatorPrefsWithCommission'
};
const versioned = [{
  // 1020 is first CC3
  minmax: [1019, 1031],
  types: (0, _util.objectSpread)({}, addrIndicesTypes, {
    BalanceLock: 'BalanceLockTo212',
    CompactAssignments: 'CompactAssignmentsTo257',
    DispatchError: 'DispatchErrorTo198',
    DispatchInfo: 'DispatchInfoTo244',
    Heartbeat: 'HeartbeatTo244',
    IdentityInfo: 'IdentityInfoTo198',
    Keys: 'SessionKeys5',
    Multiplier: 'Fixed64',
    OpenTip: 'OpenTipTo225',
    RefCount: 'RefCountTo259',
    ReferendumInfo: 'ReferendumInfoTo239',
    SlashingSpans: 'SlashingSpansTo204',
    StakingLedger: 'StakingLedgerTo223',
    Votes: 'VotesTo230',
    Weight: 'u32'
  })
}, {
  minmax: [1032, 1042],
  types: (0, _util.objectSpread)({}, addrIndicesTypes, {
    BalanceLock: 'BalanceLockTo212',
    CompactAssignments: 'CompactAssignmentsTo257',
    DispatchInfo: 'DispatchInfoTo244',
    Heartbeat: 'HeartbeatTo244',
    Keys: 'SessionKeys5',
    Multiplier: 'Fixed64',
    OpenTip: 'OpenTipTo225',
    RefCount: 'RefCountTo259',
    ReferendumInfo: 'ReferendumInfoTo239',
    SlashingSpans: 'SlashingSpansTo204',
    StakingLedger: 'StakingLedgerTo223',
    Votes: 'VotesTo230',
    Weight: 'u32'
  })
}, {
  // actual at 1045 (1043-1044 is dev)
  minmax: [1043, 1045],
  types: (0, _util.objectSpread)({}, addrIndicesTypes, {
    BalanceLock: 'BalanceLockTo212',
    CompactAssignments: 'CompactAssignmentsTo257',
    DispatchInfo: 'DispatchInfoTo244',
    Heartbeat: 'HeartbeatTo244',
    Keys: 'SessionKeys5',
    Multiplier: 'Fixed64',
    OpenTip: 'OpenTipTo225',
    RefCount: 'RefCountTo259',
    ReferendumInfo: 'ReferendumInfoTo239',
    StakingLedger: 'StakingLedgerTo223',
    Votes: 'VotesTo230',
    Weight: 'u32'
  })
}, {
  minmax: [1046, 1049],
  types: (0, _util.objectSpread)({}, sharedTypes, addrAccountIdTypes, {
    CompactAssignments: 'CompactAssignmentsTo257',
    DispatchInfo: 'DispatchInfoTo244',
    Heartbeat: 'HeartbeatTo244',
    Multiplier: 'Fixed64',
    OpenTip: 'OpenTipTo225',
    RefCount: 'RefCountTo259',
    ReferendumInfo: 'ReferendumInfoTo239',
    StakingLedger: 'StakingLedgerTo223',
    Weight: 'u32'
  })
}, {
  minmax: [1050, 1054],
  types: (0, _util.objectSpread)({}, sharedTypes, addrAccountIdTypes, {
    CompactAssignments: 'CompactAssignmentsTo257',
    DispatchInfo: 'DispatchInfoTo244',
    Heartbeat: 'HeartbeatTo244',
    Multiplier: 'Fixed64',
    OpenTip: 'OpenTipTo225',
    RefCount: 'RefCountTo259',
    ReferendumInfo: 'ReferendumInfoTo239',
    StakingLedger: 'StakingLedgerTo240',
    Weight: 'u32'
  })
}, {
  minmax: [1055, 1056],
  types: (0, _util.objectSpread)({}, sharedTypes, addrAccountIdTypes, {
    CompactAssignments: 'CompactAssignmentsTo257',
    DispatchInfo: 'DispatchInfoTo244',
    Heartbeat: 'HeartbeatTo244',
    Multiplier: 'Fixed64',
    OpenTip: 'OpenTipTo225',
    RefCount: 'RefCountTo259',
    StakingLedger: 'StakingLedgerTo240',
    Weight: 'u32'
  })
}, {
  minmax: [1057, 1061],
  types: (0, _util.objectSpread)({}, sharedTypes, addrAccountIdTypes, {
    CompactAssignments: 'CompactAssignmentsTo257',
    DispatchInfo: 'DispatchInfoTo244',
    Heartbeat: 'HeartbeatTo244',
    OpenTip: 'OpenTipTo225',
    RefCount: 'RefCountTo259'
  })
}, {
  minmax: [1062, 2012],
  types: (0, _util.objectSpread)({}, sharedTypes, addrAccountIdTypes, {
    CompactAssignments: 'CompactAssignmentsTo257',
    OpenTip: 'OpenTipTo225',
    RefCount: 'RefCountTo259'
  })
}, {
  minmax: [2013, 2022],
  types: (0, _util.objectSpread)({}, sharedTypes, addrAccountIdTypes, {
    CompactAssignments: 'CompactAssignmentsTo257',
    RefCount: 'RefCountTo259'
  })
}, {
  minmax: [2023, 2024],
  types: (0, _util.objectSpread)({}, sharedTypes, addrAccountIdTypes, {
    RefCount: 'RefCountTo259'
  })
}, {
  minmax: [2025, 2027],
  types: (0, _util.objectSpread)({}, sharedTypes, addrAccountIdTypes)
}, {
  minmax: [2028, 2029],
  types: (0, _util.objectSpread)({}, sharedTypes, {
    AccountInfo: 'AccountInfoWithDualRefCount',
    CompactAssignments: 'CompactAssignmentsWith16',
    RawSolution: 'RawSolutionWith16'
  })
}, {
  minmax: [2030, 9000],
  types: (0, _util.objectSpread)({}, sharedTypes, {
    CompactAssignments: 'CompactAssignmentsWith16',
    RawSolution: 'RawSolutionWith16'
  })
}, {
  minmax: [9010, 9099],
  types: (0, _util.objectSpread)({}, sharedTypes, (0, _typesCreate.mapXcmTypes)('V0'))
}, {
  // jump from 9100 to 9110, however align with Rococo
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
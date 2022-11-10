"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _util = require("@polkadot/util");
// Copyright 2017-2022 @polkadot/types-known authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable sort-keys */

const sharedTypes = {
  CompactAssignments: 'CompactAssignmentsWith16',
  DispatchErrorModule: 'DispatchErrorModuleU8',
  RawSolution: 'RawSolutionWith16',
  Keys: 'SessionKeys6',
  ProxyType: {
    _enum: {
      Any: 0,
      NonTransfer: 1,
      Governance: 2,
      Staking: 3,
      UnusedSudoBalances: 4,
      IdentityJudgement: 5,
      CancelProxy: 6,
      Auction: 7
    }
  },
  Weight: 'WeightV1'
};
const addrAccountIdTypes = {
  AccountInfo: 'AccountInfoWithRefCount',
  Address: 'AccountId',
  DispatchErrorModule: 'DispatchErrorModuleU8',
  Keys: 'SessionKeys5',
  LookupSource: 'AccountId',
  ValidatorPrefs: 'ValidatorPrefsWithCommission'
};

// these are override types for Polkadot
const versioned = [{
  minmax: [0, 12],
  types: (0, _util.objectSpread)({}, sharedTypes, addrAccountIdTypes, {
    CompactAssignments: 'CompactAssignmentsTo257',
    OpenTip: 'OpenTipTo225',
    RefCount: 'RefCountTo259'
  })
}, {
  minmax: [13, 22],
  types: (0, _util.objectSpread)({}, sharedTypes, addrAccountIdTypes, {
    CompactAssignments: 'CompactAssignmentsTo257',
    RefCount: 'RefCountTo259'
  })
}, {
  minmax: [23, 24],
  types: (0, _util.objectSpread)({}, sharedTypes, addrAccountIdTypes, {
    RefCount: 'RefCountTo259'
  })
}, {
  minmax: [25, 27],
  types: (0, _util.objectSpread)({}, sharedTypes, addrAccountIdTypes)
}, {
  minmax: [28, 29],
  types: (0, _util.objectSpread)({}, sharedTypes, {
    AccountInfo: 'AccountInfoWithDualRefCount'
  })
}, {
  minmax: [30, 9109],
  types: (0, _util.objectSpread)({}, sharedTypes)
}, {
  // metadata v14
  minmax: [9110, undefined],
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
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _typesCreate = require("@polkadot/types-create");
var _util = require("@polkadot/util");
var _v = require("./v0");
var _v2 = require("./v1");
var _v3 = require("./v2");
// Copyright 2017-2022 @polkadot/types authors & contributors
// SPDX-License-Identifier: Apache-2.0

// order important in structs... :)
/* eslint-disable sort-keys */

const XCM_LATEST = 'V2';
const xcm = {
  XcmOrigin: {
    _enum: {
      Xcm: 'MultiLocation'
    }
  },
  XcmpMessageFormat: {
    _enum: ['ConcatenatedVersionedXcm', 'ConcatenatedEncodedBlob', 'Signals']
  },
  XcmAssetId: {
    _enum: {
      Concrete: 'MultiLocation',
      Abstract: 'Bytes'
    }
  },
  InboundStatus: {
    _enum: ['Ok', 'Suspended']
  },
  OutboundStatus: {
    _enum: ['Ok', 'Suspended']
  },
  MultiAssets: 'Vec<MultiAsset>'
};
const location = {
  BodyId: {
    _enum: {
      Unit: 'Null',
      Named: 'Vec<u8>',
      Index: 'Compact<u32>',
      Executive: 'Null',
      Technical: 'Null',
      Legislative: 'Null',
      Judicial: 'Null'
    }
  },
  BodyPart: {
    _enum: {
      Voice: 'Null',
      Members: 'Compact<u32>',
      Fraction: {
        nom: 'Compact<u32>',
        denom: 'Compact<u32>'
      },
      AtLeastProportion: {
        nom: 'Compact<u32>',
        denom: 'Compact<u32>'
      },
      MoreThanProportion: {
        nom: 'Compact<u32>',
        denom: 'Compact<u32>'
      }
    }
  },
  InteriorMultiLocation: 'Junctions',
  NetworkId: {
    _enum: {
      Any: 'Null',
      Named: 'Vec<u8>',
      Polkadot: 'Null',
      Kusama: 'Null'
    }
  }
};
var _default = {
  rpc: {},
  types: (0, _util.objectSpread)({}, location, xcm, _v.v0, _v2.v1, _v3.v2, (0, _typesCreate.mapXcmTypes)(XCM_LATEST), {
    DoubleEncodedCall: {
      encoded: 'Vec<u8>'
    },
    XcmOriginKind: {
      _enum: ['Native', 'SovereignAccount', 'Superuser', 'Xcm']
    },
    Outcome: {
      _enum: {
        Complete: 'Weight',
        Incomplete: '(Weight, XcmErrorV0)',
        Error: 'XcmErrorV0'
      }
    },
    QueryId: 'u64',
    QueryStatus: {
      _enum: {
        Pending: {
          responder: 'VersionedMultiLocation',
          maybeNotify: 'Option<(u8, u8)>',
          timeout: 'BlockNumber'
        },
        Ready: {
          response: 'VersionedResponse',
          at: 'BlockNumber'
        }
      }
    },
    QueueConfigData: {
      suspendThreshold: 'u32',
      dropThreshold: 'u32',
      resumeThreshold: 'u32',
      thresholdWeight: 'Weight',
      weightRestrictDecay: 'Weight'
    },
    VersionMigrationStage: {
      _enum: {
        MigrateSupportedVersion: 'Null',
        MigrateVersionNotifiers: 'Null',
        NotifyCurrentTargets: 'Option<Bytes>',
        MigrateAndNotifyOldTargets: 'Null'
      }
    },
    VersionedMultiAsset: {
      _enum: {
        V0: 'MultiAssetV0',
        V1: 'MultiAssetV1',
        V2: 'MultiAssetV2'
      }
    },
    VersionedMultiAssets: {
      _enum: {
        V0: 'Vec<MultiAssetV0>',
        V1: 'MultiAssetsV1',
        V2: 'MultiAssetsV2'
      }
    },
    VersionedMultiLocation: {
      _enum: {
        V0: 'MultiLocationV0',
        V1: 'MultiLocationV1',
        V2: 'MultiLocationV2'
      }
    },
    VersionedResponse: {
      V0: 'ResponseV0',
      V1: 'ResponseV1',
      V2: 'ResponseV2'
    },
    VersionedXcm: {
      _enum: {
        V0: 'XcmV0',
        V1: 'XcmV1',
        V2: 'XcmV2'
      }
    },
    XcmVersion: 'u32'
  })
};
exports.default = _default;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "AllHashers", {
  enumerable: true,
  get: function () {
    return _hashers.AllHashers;
  }
});
exports.default = void 0;
var _util = require("@polkadot/util");
var _hashers = require("./hashers");
var _runtime = require("./runtime");
var _v = require("./v9");
var _v2 = require("./v10");
var _v3 = require("./v11");
var _v4 = require("./v12");
var _v5 = require("./v13");
var _v6 = require("./v14");
// Copyright 2017-2022 @polkadot/types authors & contributors
// SPDX-License-Identifier: Apache-2.0
// order important in structs... :)
/* eslint-disable sort-keys */
var _default = {
  rpc: {},
  runtime: _runtime.runtime,
  types: (0, _util.objectSpread)({}, _v.v9, _v2.v10, _v3.v11, _v4.v12, _v5.v13, _v6.v14, {
    // latest mappings
    ErrorMetadataLatest: 'ErrorMetadataV14',
    EventMetadataLatest: 'EventMetadataV14',
    ExtrinsicMetadataLatest: 'ExtrinsicMetadataV14',
    FunctionArgumentMetadataLatest: 'FunctionArgumentMetadataV14',
    FunctionMetadataLatest: 'FunctionMetadataV14',
    MetadataLatest: 'MetadataV14',
    PalletCallMetadataLatest: 'PalletCallMetadataV14',
    PalletConstantMetadataLatest: 'PalletConstantMetadataV14',
    PalletErrorMetadataLatest: 'PalletErrorMetadataV14',
    PalletEventMetadataLatest: 'PalletEventMetadataV14',
    PalletMetadataLatest: 'PalletMetadataV14',
    PalletStorageMetadataLatest: 'PalletStorageMetadataV14',
    PortableType: 'PortableTypeV14',
    SignedExtensionMetadataLatest: 'SignedExtensionMetadataV14',
    StorageEntryMetadataLatest: 'StorageEntryMetadataV14',
    StorageEntryModifierLatest: 'StorageEntryModifierV14',
    StorageEntryTypeLatest: 'StorageEntryTypeV14',
    StorageHasher: 'StorageHasherV14',
    // additional types
    OpaqueMetadata: 'Opaque<Bytes>',
    // the enum containing all the mappings
    MetadataAll: {
      _enum: {
        V0: 'DoNotConstruct<MetadataV0>',
        V1: 'DoNotConstruct<MetadataV1>',
        V2: 'DoNotConstruct<MetadataV2>',
        V3: 'DoNotConstruct<MetadataV3>',
        V4: 'DoNotConstruct<MetadataV4>',
        V5: 'DoNotConstruct<MetadataV5>',
        V6: 'DoNotConstruct<MetadataV6>',
        V7: 'DoNotConstruct<MetadataV7>',
        V8: 'DoNotConstruct<MetadataV8>',
        // First version on Kusama in V9, dropping will be problematic
        V9: 'MetadataV9',
        V10: 'MetadataV10',
        V11: 'MetadataV11',
        V12: 'MetadataV12',
        V13: 'MetadataV13',
        V14: 'MetadataV14'
      }
    }
  })
};
exports.default = _default;
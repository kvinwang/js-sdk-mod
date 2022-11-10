// Copyright 2017-2022 @polkadot/types authors & contributors
// SPDX-License-Identifier: Apache-2.0

// order important in structs... :)
/* eslint-disable sort-keys */

import { objectSpread } from '@polkadot/util';
import { AllHashers } from "./hashers.js";
import { runtime } from "./runtime.js";
import { v9 } from "./v9.js";
import { v10 } from "./v10.js";
import { v11 } from "./v11.js";
import { v12 } from "./v12.js";
import { v13 } from "./v13.js";
import { v14 } from "./v14.js";
export { AllHashers };
export default {
  rpc: {},
  runtime,
  types: objectSpread({}, v9, v10, v11, v12, v13, v14, {
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
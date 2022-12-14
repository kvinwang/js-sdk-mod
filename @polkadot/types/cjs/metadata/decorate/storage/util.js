"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createRuntimeFunction = createRuntimeFunction;
var _createFunction = require("./createFunction");
// Copyright 2017-2022 @polkadot/types authors & contributors
// SPDX-License-Identifier: Apache-2.0

function findSiPrimitive(registry, _prim) {
  const prim = _prim.toLowerCase();
  return registry.lookup.types.find(t => t.type.def.isPrimitive && t.type.def.asPrimitive.toString().toLowerCase() === prim || t.type.def.isHistoricMetaCompat && t.type.def.asHistoricMetaCompat.toString().toLowerCase() === prim);
}
function findSiType(registry, orig) {
  let portable = findSiPrimitive(registry, orig);
  if (!portable && orig === 'Bytes') {
    const u8 = findSiPrimitive(registry, 'u8');
    if (u8) {
      portable = registry.lookup.types.find(t => t.type.def.isSequence && t.type.def.asSequence.type.eq(u8.id) || t.type.def.isHistoricMetaCompat && t.type.def.asHistoricMetaCompat.eq(orig));
    }
  }
  if (!portable) {
    console.warn(`Unable to map ${orig} to a lookup index`);
  }
  return portable;
}

// Small helper function to factorize code on this page.
/** @internal */
function createRuntimeFunction(_ref, key, _ref2) {
  let {
    method,
    prefix,
    section
  } = _ref;
  let {
    docs,
    type
  } = _ref2;
  return registry => {
    var _findSiType;
    return (0, _createFunction.createFunction)(registry, {
      meta: registry.createTypeUnsafe('StorageEntryMetadataLatest', [{
        docs: registry.createTypeUnsafe('Vec<Text>', [[docs]]),
        modifier: registry.createTypeUnsafe('StorageEntryModifierLatest', ['Required']),
        name: registry.createTypeUnsafe('Text', [method]),
        toJSON: () => key,
        type: registry.createTypeUnsafe('StorageEntryTypeLatest', [{
          Plain: ((_findSiType = findSiType(registry, type)) == null ? void 0 : _findSiType.id) || 0
        }])
      }]),
      method,
      prefix,
      section
    }, {
      key,
      skipHashing: true
    });
  };
}
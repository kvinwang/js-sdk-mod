"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toV14 = toV14;
var _util = require("@polkadot/util");
var _alias = require("../../interfaces/alias");
var _definitions = require("../../interfaces/runtime/definitions");
// Copyright 2017-2022 @polkadot/types authors & contributors
// SPDX-License-Identifier: Apache-2.0

const BOXES = [['<', '>'], ['<', ','], [',', '>'], ['(', ')'], ['(', ','], [',', ','], [',', ')']];

/**
 * Creates a compatible type mapping
 * @internal
 **/
function compatType(specs, _type) {
  const type = _type.toString();
  const index = specs.findIndex(_ref => {
    let {
      def
    } = _ref;
    return def.HistoricMetaCompat === type;
  });
  if (index !== -1) {
    return index;
  }
  return specs.push({
    def: {
      HistoricMetaCompat: type
    }
  }) - 1;
}
function compatTypes(specs) {
  for (let i = 0; i < (arguments.length <= 1 ? 0 : arguments.length - 1); i++) {
    compatType(specs, i + 1 < 1 || arguments.length <= i + 1 ? undefined : arguments[i + 1]);
  }
}
function makeTupleType(specs, entries) {
  return specs.push({
    def: {
      Tuple: entries
    }
  }) - 1;
}
function makeVariantType(modName, variantType, specs, variants) {
  return specs.push({
    def: {
      Variant: {
        variants
      }
    },
    path: [`pallet_${modName.toString()}`, 'pallet', variantType]
  }) - 1;
}

/**
 * @internal
 * generate & register the OriginCaller type
 **/
function registerOriginCaller(registry, modules, metaVersion) {
  registry.register({
    OriginCaller: {
      _enum: modules.map((mod, index) => [mod.name.toString(), metaVersion >= 12 ? mod.index.toNumber() : index]).sort((a, b) => a[1] - b[1]).reduce((result, _ref2) => {
        let [name, index] = _ref2;
        for (let i = Object.keys(result).length; i < index; i++) {
          result[`Empty${i}`] = 'Null';
        }
        result[name] = _definitions.knownOrigins[name] || 'Null';
        return result;
      }, {})
    }
  });
}

/**
 * Find and apply the correct type override
 * @internal
 **/
function setTypeOverride(sectionTypes, types) {
  types.forEach(type => {
    const override = Object.keys(sectionTypes).find(aliased => type.eq(aliased));
    if (override) {
      type.setOverride(sectionTypes[override]);
    } else {
      // FIXME: NOT happy with this approach, but gets over the initial hump cased by (Vec<Announcement>,BalanceOf)
      const orig = type.toString();
      const alias = Object.entries(sectionTypes).reduce((result, _ref3) => {
        let [src, dst] = _ref3;
        return BOXES.reduce((result, _ref4) => {
          let [a, z] = _ref4;
          return result.replace(`${a}${src}${z}`, `${a}${dst}${z}`);
        }, result);
      }, orig);
      if (orig !== alias) {
        type.setOverride(alias);
      }
    }
  });
}

/**
 * Apply module-specific type overrides (always be done as part of toV14)
 * @internal
 **/
function convertCalls(specs, registry, modName, calls, sectionTypes) {
  const variants = calls.map((_ref5, index) => {
    let {
      args,
      docs,
      name
    } = _ref5;
    setTypeOverride(sectionTypes, args.map(_ref6 => {
      let {
        type
      } = _ref6;
      return type;
    }));
    return registry.createTypeUnsafe('SiVariant', [{
      docs,
      fields: args.map(_ref7 => {
        let {
          name,
          type
        } = _ref7;
        return registry.createTypeUnsafe('SiField', [{
          name,
          type: compatType(specs, type)
        }]);
      }),
      index,
      name
    }]);
  });
  return registry.createTypeUnsafe('PalletCallMetadataV14', [{
    type: makeVariantType(modName, 'Call', specs, variants)
  }]);
}

/**
 * Apply module-specific type overrides (always be done as part of toV14)
 * @internal
 */
function convertConstants(specs, registry, constants, sectionTypes) {
  return constants.map(_ref8 => {
    let {
      docs,
      name,
      type,
      value
    } = _ref8;
    setTypeOverride(sectionTypes, [type]);
    return registry.createTypeUnsafe('PalletConstantMetadataV14', [{
      docs,
      name,
      type: compatType(specs, type),
      value
    }]);
  });
}

/**
 * Apply module-specific type overrides (always be done as part of toV14)
 * @internal
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function convertErrors(specs, registry, modName, errors, _sectionTypes) {
  const variants = errors.map((_ref9, index) => {
    let {
      docs,
      name
    } = _ref9;
    return registry.createTypeUnsafe('SiVariant', [{
      docs,
      fields: [],
      index,
      name
    }]);
  });
  return registry.createTypeUnsafe('PalletErrorMetadataV14', [{
    type: makeVariantType(modName, 'Error', specs, variants)
  }]);
}

/**
 * Apply module-specific type overrides (always be done as part of toV14)
 * @internal
 **/
function convertEvents(specs, registry, modName, events, sectionTypes) {
  const variants = events.map((_ref10, index) => {
    let {
      args,
      docs,
      name
    } = _ref10;
    setTypeOverride(sectionTypes, args);
    return registry.createTypeUnsafe('SiVariant', [{
      docs,
      fields: args.map(t => registry.createTypeUnsafe('SiField', [{
        type: compatType(specs, t)
      }])),
      index,
      name
    }]);
  });
  return registry.createTypeUnsafe('PalletEventMetadataV14', [{
    type: makeVariantType(modName, 'Event', specs, variants)
  }]);
}
function createMapEntry(specs, registry, sectionTypes, _ref11) {
  let {
    hashers,
    isLinked,
    isOptional,
    keys,
    value
  } = _ref11;
  setTypeOverride(sectionTypes, [value, ...(Array.isArray(keys) ? keys : [keys])]);
  return registry.createTypeUnsafe('StorageEntryTypeV14', [{
    Map: {
      hashers,
      key: hashers.length === 1 ? compatType(specs, keys[0]) : makeTupleType(specs, keys.map(t => compatType(specs, t))),
      value: isLinked
      // For previous-generation linked-map support, the actual storage result
      // is a Tuple with the value and the Linkage (Option appears in teh value-part only)
      ? compatType(specs, `(${isOptional ? `Option<${value.toString()}>` : value.toString()}, Linkage<${keys[0].toString()}>)`) : compatType(specs, value)
    }
  }]);
}

/**
 * Apply module-specific storage type overrides (always part of toV14)
 * @internal
 **/
function convertStorage(specs, registry, _ref12, sectionTypes) {
  let {
    items,
    prefix
  } = _ref12;
  return registry.createTypeUnsafe('PalletStorageMetadataV14', [{
    items: items.map(_ref13 => {
      let {
        docs,
        fallback,
        modifier,
        name,
        type
      } = _ref13;
      let entryType;
      if (type.isPlain) {
        const plain = type.asPlain;
        setTypeOverride(sectionTypes, [plain]);
        entryType = registry.createTypeUnsafe('StorageEntryTypeV14', [{
          Plain: compatType(specs, plain)
        }]);
      } else if (type.isMap) {
        const map = type.asMap;
        entryType = createMapEntry(specs, registry, sectionTypes, {
          hashers: [map.hasher],
          isLinked: map.linked.isTrue,
          isOptional: modifier.isOptional,
          keys: [map.key],
          value: map.value
        });
      } else if (type.isDoubleMap) {
        const dm = type.asDoubleMap;
        entryType = createMapEntry(specs, registry, sectionTypes, {
          hashers: [dm.hasher, dm.key2Hasher],
          isLinked: false,
          isOptional: modifier.isOptional,
          keys: [dm.key1, dm.key2],
          value: dm.value
        });
      } else {
        const nm = type.asNMap;
        entryType = createMapEntry(specs, registry, sectionTypes, {
          hashers: nm.hashers,
          isLinked: false,
          isOptional: modifier.isOptional,
          keys: nm.keyVec,
          value: nm.value
        });
      }
      return registry.createTypeUnsafe('StorageEntryMetadataV14', [{
        docs,
        fallback,
        modifier,
        name,
        type: entryType
      }]);
    }),
    prefix
  }]);
}

/** @internal */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function convertExtrinsic(registry, _ref14) {
  let {
    signedExtensions,
    version
  } = _ref14;
  return registry.createTypeUnsafe('ExtrinsicMetadataV14', [{
    signedExtensions: signedExtensions.map(identifier => ({
      identifier,
      type: 0 // we don't map the fields at all
    })),

    type: 0,
    // Map to extrinsic like in v14?
    version
  }]);
}

/** @internal */
function createPallet(specs, registry, mod, _ref15) {
  let {
    calls,
    constants,
    errors,
    events,
    storage
  } = _ref15;
  const sectionTypes = (0, _alias.getAliasTypes)(registry, (0, _util.stringCamelCase)(mod.name));
  return registry.createTypeUnsafe('PalletMetadataV14', [{
    calls: calls && convertCalls(specs, registry, mod.name, calls, sectionTypes),
    constants: convertConstants(specs, registry, constants, sectionTypes),
    errors: errors && convertErrors(specs, registry, mod.name, errors, sectionTypes),
    events: events && convertEvents(specs, registry, mod.name, events, sectionTypes),
    index: mod.index,
    name: mod.name,
    storage: storage && convertStorage(specs, registry, storage, sectionTypes)
  }]);
}

/**
 * Convert the Metadata to v14
 * @internal
 **/
function toV14(registry, v13, metaVersion) {
  const specs = [];

  // position 0 always has Null, additionally add internal defaults
  compatTypes(specs, 'Null', 'u8', 'u16', 'u32', 'u64');
  registerOriginCaller(registry, v13.modules, metaVersion);
  const extrinsic = convertExtrinsic(registry, v13.extrinsic);
  const pallets = v13.modules.map(mod => createPallet(specs, registry, mod, {
    calls: mod.calls.unwrapOr(null),
    constants: mod.constants,
    errors: mod.errors.length ? mod.errors : null,
    events: mod.events.unwrapOr(null),
    storage: mod.storage.unwrapOr(null)
  }));
  return registry.createTypeUnsafe('MetadataV14', [{
    extrinsic,
    lookup: {
      types: specs.map((type, id) => registry.createTypeUnsafe('PortableType', [{
        id,
        type
      }]))
    },
    pallets
  }]);
}
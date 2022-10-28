"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TypeRegistry = void 0;

var _typesCodec = require("@polkadot/types-codec");

var _typesCreate = require("@polkadot/types-create");

var _util = require("@polkadot/util");

var _utilCrypto = require("@polkadot/util-crypto");

var _signedExtensions = require("../extrinsic/signedExtensions");

var _Event = require("../generic/Event");

var baseTypes = _interopRequireWildcard(require("../index.types"));

var definitions = _interopRequireWildcard(require("../interfaces/definitions"));

var _decorate = require("../metadata/decorate");

var _extrinsics = require("../metadata/decorate/extrinsics");

var _Metadata = require("../metadata/Metadata");

var _PortableRegistry = require("../metadata/PortableRegistry");

var _lazy = require("./lazy");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

// Copyright 2017-2022 @polkadot/types authors & contributors
// SPDX-License-Identifier: Apache-2.0
const DEFAULT_FIRST_CALL_IDX = new Uint8Array(2);
const l = (0, _util.logger)('registry');

function sortDecimalStrings(a, b) {
  return parseInt(a, 10) - parseInt(b, 10);
}

function valueToString(v) {
  return v.toString();
}

function getFieldArgs(lookup, fields) {
  const args = new Array(fields.length);

  for (let i = 0; i < fields.length; i++) {
    args[i] = lookup.getTypeDef(fields[i].type).type;
  }

  return args;
}

function clearRecord(record) {
  const keys = Object.keys(record);

  for (let i = 0; i < keys.length; i++) {
    delete record[keys[i]];
  }
}

function getVariantStringIdx(_ref) {
  let {
    index
  } = _ref;
  return index.toString();
} // create error mapping from metadata


function injectErrors(_, _ref2, version, result) {
  let {
    lookup,
    pallets
  } = _ref2;
  clearRecord(result);

  for (let i = 0; i < pallets.length; i++) {
    const {
      errors,
      index,
      name
    } = pallets[i];

    if (errors.isSome) {
      const sectionName = (0, _util.stringCamelCase)(name);
      (0, _util.lazyMethod)(result, version >= 12 ? index.toNumber() : i, () => (0, _lazy.lazyVariants)(lookup, errors.unwrap(), getVariantStringIdx, _ref3 => {
        let {
          docs,
          fields,
          index,
          name
        } = _ref3;
        return {
          args: getFieldArgs(lookup, fields),
          docs: docs.map(valueToString),
          fields,
          index: index.toNumber(),
          method: name.toString(),
          name: name.toString(),
          section: sectionName
        };
      }));
    }
  }
} // create event classes from metadata


function injectEvents(registry, _ref4, version, result) {
  let {
    lookup,
    pallets
  } = _ref4;
  const filtered = pallets.filter(_decorate.filterEventsSome);
  clearRecord(result);

  for (let i = 0; i < filtered.length; i++) {
    const {
      events,
      index,
      name
    } = filtered[i];
    (0, _util.lazyMethod)(result, version >= 12 ? index.toNumber() : i, () => (0, _lazy.lazyVariants)(lookup, events.unwrap(), getVariantStringIdx, variant => {
      const meta = registry.createType('EventMetadataLatest', (0, _util.objectSpread)({}, variant, {
        args: getFieldArgs(lookup, variant.fields)
      }));
      return class extends _Event.GenericEventData {
        constructor(registry, value) {
          super(registry, value, meta, (0, _util.stringCamelCase)(name), variant.name.toString());
        }

      };
    }));
  }
} // create extrinsic mapping from metadata


function injectExtrinsics(registry, _ref5, version, result, mapping) {
  let {
    lookup,
    pallets
  } = _ref5;
  const filtered = pallets.filter(_decorate.filterCallsSome);
  clearRecord(result);
  clearRecord(mapping);

  for (let i = 0; i < filtered.length; i++) {
    const {
      calls,
      index,
      name
    } = filtered[i];
    const sectionIndex = version >= 12 ? index.toNumber() : i;
    const sectionName = (0, _util.stringCamelCase)(name);
    const allCalls = calls.unwrap();
    (0, _util.lazyMethod)(result, sectionIndex, () => (0, _lazy.lazyVariants)(lookup, allCalls, getVariantStringIdx, variant => (0, _extrinsics.createCallFunction)(registry, lookup, variant, sectionName, sectionIndex)));
    const {
      path
    } = registry.lookup.getSiType(allCalls.type); // frame_system::pallet::Call / pallet_balances::pallet::Call / polkadot_runtime_parachains::configuration::pallet::Call /

    const palletIdx = path.findIndex(v => v.eq('pallet'));

    if (palletIdx !== -1) {
      const name = (0, _util.stringCamelCase)(path.slice(0, palletIdx).map((p, i) => i === 0 // frame_system || pallet_balances
      ? p.replace(/^(frame|pallet)_/, '') : p).join(' '));

      if (!mapping[name]) {
        mapping[name] = [sectionName];
      } else {
        mapping[name].push(sectionName);
      }
    }
  }
} // extract additional properties from the metadata


function extractProperties(registry, metadata) {
  const original = registry.getChainProperties();
  const constants = (0, _decorate.decorateConstants)(registry, metadata.asLatest, metadata.version);
  const ss58Format = constants.system && (constants.system.sS58Prefix || constants.system.ss58Prefix);

  if (!ss58Format) {
    return original;
  }

  const {
    tokenDecimals,
    tokenSymbol
  } = original || {};
  return registry.createTypeUnsafe('ChainProperties', [{
    ss58Format,
    tokenDecimals,
    tokenSymbol
  }]);
}

class TypeRegistry {
  #classes = new Map();
  #definitions = new Map();
  #firstCallIndex = null;
  #lookup;
  #metadata;
  #metadataVersion = 0;
  #metadataCalls = {};
  #metadataErrors = {};
  #metadataEvents = {};
  #moduleMap = {};
  #unknownTypes = new Map();
  #chainProperties;
  #hasher = _utilCrypto.blake2AsU8a;
  #knownDefaults;
  #knownDefinitions;
  #knownTypes = {};
  #signedExtensions = _signedExtensions.fallbackExtensions;
  #userExtensions;

  constructor(createdAtHash) {
    this.#knownDefaults = (0, _util.objectSpread)({
      Json: _typesCodec.Json,
      Metadata: _Metadata.Metadata,
      PortableRegistry: _PortableRegistry.PortableRegistry,
      Raw: _typesCodec.Raw
    }, baseTypes);
    this.#knownDefinitions = definitions;
    const allKnown = Object.values(this.#knownDefinitions);

    for (let i = 0; i < allKnown.length; i++) {
      this.register(allKnown[i].types);
    }

    if (createdAtHash) {
      this.createdAtHash = this.createType('Hash', createdAtHash);
    }
  }

  get chainDecimals() {
    var _this$chainProperties;

    if ((_this$chainProperties = this.#chainProperties) !== null && _this$chainProperties !== void 0 && _this$chainProperties.tokenDecimals.isSome) {
      const allDecimals = this.#chainProperties.tokenDecimals.unwrap();

      if (allDecimals.length) {
        return allDecimals.map(b => b.toNumber());
      }
    }

    return [12];
  }

  get chainSS58() {
    var _this$chainProperties2;

    return (_this$chainProperties2 = this.#chainProperties) !== null && _this$chainProperties2 !== void 0 && _this$chainProperties2.ss58Format.isSome ? this.#chainProperties.ss58Format.unwrap().toNumber() : undefined;
  }

  get chainTokens() {
    var _this$chainProperties3;

    if ((_this$chainProperties3 = this.#chainProperties) !== null && _this$chainProperties3 !== void 0 && _this$chainProperties3.tokenSymbol.isSome) {
      const allTokens = this.#chainProperties.tokenSymbol.unwrap();

      if (allTokens.length) {
        return allTokens.map(valueToString);
      }
    }

    return [_util.formatBalance.getDefaults().unit];
  }

  get firstCallIndex() {
    return this.#firstCallIndex || DEFAULT_FIRST_CALL_IDX;
  }
  /**
   * @description Returns true if the type is in a Compat format
   */


  isLookupType(value) {
    return /Lookup\d+$/.test(value);
  }
  /**
   * @description Creates a lookup string from the supplied id
   */


  createLookupType(lookupId) {
    return `Lookup${lookupId.toString()}`;
  }

  get knownTypes() {
    return this.#knownTypes;
  }

  get lookup() {
    return (0, _util.assertReturn)(this.#lookup, 'Lookup has not been set on this registry');
  }

  get metadata() {
    return (0, _util.assertReturn)(this.#metadata, 'Metadata has not been set on this registry');
  }

  get unknownTypes() {
    return [...this.#unknownTypes.keys()];
  }

  get signedExtensions() {
    return this.#signedExtensions;
  }

  clearCache() {
    this.#classes = new Map();
  }
  /**
   * @describe Creates an instance of the class
   */


  createClass(type) {
    return (0, _typesCreate.createClassUnsafe)(this, type);
  }
  /**
   * @describe Creates an instance of the class
   */


  createClassUnsafe(type) {
    return (0, _typesCreate.createClassUnsafe)(this, type);
  }
  /**
   * @description Creates an instance of a type as registered
   */


  createType(type) {
    for (var _len = arguments.length, params = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      params[_key - 1] = arguments[_key];
    }

    return (0, _typesCreate.createTypeUnsafe)(this, type, params);
  }
  /**
   * @description Creates an instance of a type as registered
   */


  createTypeUnsafe(type, params, options) {
    return (0, _typesCreate.createTypeUnsafe)(this, type, params, options);
  } // find a specific call


  findMetaCall(callIndex) {
    const [section, method] = [callIndex[0], callIndex[1]];
    return (0, _util.assertReturn)(this.#metadataCalls[`${section}`] && this.#metadataCalls[`${section}`][`${method}`], () => `findMetaCall: Unable to find Call with index [${section}, ${method}]/[${callIndex.toString()}]`);
  } // finds an error


  findMetaError(errorIndex) {
    const [section, method] = (0, _util.isU8a)(errorIndex) ? [errorIndex[0], errorIndex[1]] : [errorIndex.index.toNumber(), (0, _util.isU8a)(errorIndex.error) ? errorIndex.error[0] : errorIndex.error.toNumber()];
    return (0, _util.assertReturn)(this.#metadataErrors[`${section}`] && this.#metadataErrors[`${section}`][`${method}`], () => `findMetaError: Unable to find Error with index [${section}, ${method}]/[${errorIndex.toString()}]`);
  }

  findMetaEvent(eventIndex) {
    const [section, method] = [eventIndex[0], eventIndex[1]];
    return (0, _util.assertReturn)(this.#metadataEvents[`${section}`] && this.#metadataEvents[`${section}`][`${method}`], () => `findMetaEvent: Unable to find Event with index [${section}, ${method}]/[${eventIndex.toString()}]`);
  }

  get(name, withUnknown, knownTypeDef) {
    return this.getUnsafe(name, withUnknown, knownTypeDef);
  }

  getUnsafe(name, withUnknown, knownTypeDef) {
    let Type = this.#classes.get(name) || this.#knownDefaults[name]; // we have not already created the type, attempt it

    if (!Type) {
      const definition = this.#definitions.get(name);
      let BaseType; // we have a definition, so create the class now (lazily)

      if (definition) {
        BaseType = (0, _typesCreate.createClassUnsafe)(this, definition);
      } else if (knownTypeDef) {
        BaseType = (0, _typesCreate.constructTypeClass)(this, knownTypeDef);
      } else if (withUnknown) {
        l.warn(`Unable to resolve type ${name}, it will fail on construction`);
        this.#unknownTypes.set(name, true);
        BaseType = _typesCodec.DoNotConstruct.with(name);
      }

      if (BaseType) {
        // NOTE If we didn't extend here, we would have strange artifacts. An example is
        // Balance, with this, new Balance() instanceof u128 is true, but Balance !== u128
        // Additionally, we now pass through the registry, which is a link to ourselves
        Type = class extends BaseType {};
        this.#classes.set(name, Type); // In the case of lookups, we also want to store the actual class against
        // the lookup name, instad of having to traverse again

        if (knownTypeDef && (0, _util.isNumber)(knownTypeDef.lookupIndex)) {
          this.#classes.set(this.createLookupType(knownTypeDef.lookupIndex), Type);
        }
      }
    }

    return Type;
  }

  getChainProperties() {
    return this.#chainProperties;
  }

  getClassName(Type) {
    // we cannot rely on export order (anymore, since babel/core 7.15.8), so in the case of
    // items such as u32 & U32, we get the lowercase versions here... not quite as optimal
    // (previously this used to be a simple find & return)
    const names = [];

    for (const [name, Clazz] of Object.entries(this.#knownDefaults)) {
      if (Type === Clazz) {
        names.push(name);
      }
    }

    for (const [name, Clazz] of this.#classes.entries()) {
      if (Type === Clazz) {
        names.push(name);
      }
    } // both sort and reverse are done in-place


    names.sort().reverse();
    return names.length ? names[0] : undefined;
  }

  getDefinition(typeName) {
    return this.#definitions.get(typeName);
  }

  getModuleInstances(specName, moduleName) {
    var _this$knownTypes, _this$knownTypes$type, _this$knownTypes$type2, _this$knownTypes$type3, _this$knownTypes$type4;

    return ((_this$knownTypes = this.#knownTypes) === null || _this$knownTypes === void 0 ? void 0 : (_this$knownTypes$type = _this$knownTypes.typesBundle) === null || _this$knownTypes$type === void 0 ? void 0 : (_this$knownTypes$type2 = _this$knownTypes$type.spec) === null || _this$knownTypes$type2 === void 0 ? void 0 : (_this$knownTypes$type3 = _this$knownTypes$type2[specName.toString()]) === null || _this$knownTypes$type3 === void 0 ? void 0 : (_this$knownTypes$type4 = _this$knownTypes$type3.instances) === null || _this$knownTypes$type4 === void 0 ? void 0 : _this$knownTypes$type4[moduleName]) || this.#moduleMap[moduleName];
  }

  getOrThrow(name, msg) {
    const Clazz = this.get(name);

    if (!Clazz) {
      throw new Error(msg || `type ${name} not found`);
    }

    return Clazz;
  }

  getOrUnknown(name) {
    return this.get(name, true);
  }

  getSignedExtensionExtra() {
    return (0, _signedExtensions.expandExtensionTypes)(this.#signedExtensions, 'payload', this.#userExtensions);
  }

  getSignedExtensionTypes() {
    return (0, _signedExtensions.expandExtensionTypes)(this.#signedExtensions, 'extrinsic', this.#userExtensions);
  }

  hasClass(name) {
    return this.#classes.has(name) || !!this.#knownDefaults[name];
  }

  hasDef(name) {
    return this.#definitions.has(name);
  }

  hasType(name) {
    return !this.#unknownTypes.get(name) && (this.hasClass(name) || this.hasDef(name));
  }

  hash(data) {
    return this.createType('CodecHash', this.#hasher(data));
  }

  // eslint-disable-next-line no-dupe-class-members
  register(arg1, arg2) {
    // NOTE Constructors appear as functions here
    if ((0, _util.isFunction)(arg1)) {
      this.#classes.set(arg1.name, arg1);
    } else if ((0, _util.isString)(arg1)) {
      if (!(0, _util.isFunction)(arg2)) {
        throw new Error(`Expected class definition passed to '${arg1}' registration`);
      } else if (arg1 === arg2.toString()) {
        throw new Error(`Unable to register circular ${arg1} === ${arg1}`);
      }

      this.#classes.set(arg1, arg2);
    } else {
      this._registerObject(arg1);
    }
  }

  _registerObject(obj) {
    const entries = Object.entries(obj);

    for (let e = 0; e < entries.length; e++) {
      const [name, type] = entries[e];

      if ((0, _util.isFunction)(type)) {
        // This _looks_ a bit funny, but `typeof Clazz === 'function'
        this.#classes.set(name, type);
      } else {
        const def = (0, _util.isString)(type) ? type : (0, _util.stringify)(type);

        if (name === def) {
          throw new Error(`Unable to register circular ${name} === ${def}`);
        } // we already have this type, remove the classes registered for it


        if (this.#classes.has(name)) {
          this.#classes.delete(name);
        }

        this.#definitions.set(name, def);
      }
    }
  } // sets the chain properties


  setChainProperties(properties) {
    if (properties) {
      this.#chainProperties = properties;
    }
  }

  setHasher(hasher) {
    this.#hasher = hasher || _utilCrypto.blake2AsU8a;
  }

  setKnownTypes(knownTypes) {
    this.#knownTypes = knownTypes;
  }

  setLookup(lookup) {
    this.#lookup = lookup; // register all applicable types found

    lookup.register();
  } // sets the metadata


  setMetadata(metadata, signedExtensions, userExtensions) {
    this.#metadata = metadata.asLatest;
    this.#metadataVersion = metadata.version;
    this.#firstCallIndex = null; // attach the lookup at this point (before injecting)

    this.setLookup(this.#metadata.lookup);
    injectExtrinsics(this, this.#metadata, this.#metadataVersion, this.#metadataCalls, this.#moduleMap);
    injectErrors(this, this.#metadata, this.#metadataVersion, this.#metadataErrors);
    injectEvents(this, this.#metadata, this.#metadataVersion, this.#metadataEvents); // set the default call index (the lowest section, the lowest method)
    // in most chains this should be 0,0

    const [defSection] = Object.keys(this.#metadataCalls).sort(sortDecimalStrings);

    if (defSection) {
      const [defMethod] = Object.keys(this.#metadataCalls[defSection]).sort(sortDecimalStrings);

      if (defMethod) {
        this.#firstCallIndex = new Uint8Array([parseInt(defSection, 10), parseInt(defMethod, 10)]);
      }
    } // setup the available extensions


    this.setSignedExtensions(signedExtensions || (this.#metadata.extrinsic.version.gt(_util.BN_ZERO) // FIXME Use the extension and their injected types
    ? this.#metadata.extrinsic.signedExtensions.map(_ref6 => {
      let {
        identifier
      } = _ref6;
      return identifier.toString();
    }) : _signedExtensions.fallbackExtensions), userExtensions); // setup the chain properties with format overrides

    this.setChainProperties(extractProperties(this, metadata));
  } // sets the available signed extensions


  setSignedExtensions() {
    let signedExtensions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _signedExtensions.fallbackExtensions;
    let userExtensions = arguments.length > 1 ? arguments[1] : undefined;
    this.#signedExtensions = signedExtensions;
    this.#userExtensions = userExtensions;
    const unknown = (0, _signedExtensions.findUnknownExtensions)(this.#signedExtensions, this.#userExtensions);

    if (unknown.length) {
      l.warn(`Unknown signed extensions ${unknown.join(', ')} found, treating them as no-effect`);
    }
  }

}

exports.TypeRegistry = TypeRegistry;
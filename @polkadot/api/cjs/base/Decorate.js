"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Decorate = void 0;
var _rxjs = require("rxjs");
var _apiDerive = require("@polkadot/api-derive");
var _rpcCore = require("@polkadot/rpc-core");
var _rpcProvider = require("@polkadot/rpc-provider");
var _types = require("@polkadot/types");
var _typesKnown = require("@polkadot/types-known");
var _util = require("@polkadot/util");
var _utilCrypto = require("@polkadot/util-crypto");
var _submittable = require("../submittable");
var _augmentObject = require("../util/augmentObject");
var _decorate = require("../util/decorate");
var _validate = require("../util/validate");
var _Events = require("./Events");
var _find = require("./find");
// Copyright 2017-2022 @polkadot/api authors & contributors
// SPDX-License-Identifier: Apache-2.0

// the max amount of keys/values that we will retrieve at once
const PAGE_SIZE_K = 1000; // limit aligned with the 1k on the node (trie lookups are heavy)
const PAGE_SIZE_V = 250; // limited since the data may be > 16MB (e.g. misfiring elections)
const PAGE_SIZE_Q = 50; // queue of pending storage queries (mapped together, next tick)

const l = (0, _util.logger)('api/init');
let instanceCounter = 0;
function getAtQueryFn(api, _ref) {
  let {
    method,
    section
  } = _ref;
  return (0, _util.assertReturn)(api.rx.query[section] && api.rx.query[section][method], () => `query.${section}.${method} is not available in this version of the metadata`);
}
class Decorate extends _Events.Events {
  #instanceId;
  #registry;
  #runtimeLog = {};
  #storageGetQ = [];
  #storageSubQ = [];

  // HACK Use BN import so decorateDerive works... yes, wtf.
  __phantom = new _util.BN(0);
  _call = {};
  _consts = {};
  _errors = {};
  _events = {};
  _extrinsicType = _types.GenericExtrinsic.LATEST_EXTRINSIC_VERSION;
  _isReady = false;
  _query = {};
  _runtimeMap = {};
  _rx = {
    call: {},
    consts: {},
    query: {},
    tx: {}
  };
  /**
   * @description Create an instance of the class
   *
   * @param options Options object to create API instance or a Provider instance
   *
   * @example
   * <BR>
   *
   * ```javascript
   * import Api from '@polkadot/api/promise';
   *
   * const api = new Api().isReady();
   *
   * api.rpc.subscribeNewHeads((header) => {
   *   console.log(`new block #${header.number.toNumber()}`);
   * });
   * ```
   */
  constructor(options, type, decorateMethod) {
    var _options$source;
    super();
    this.#instanceId = `${++instanceCounter}`;
    this.#registry = ((_options$source = options.source) == null ? void 0 : _options$source.registry) || options.registry || new _types.TypeRegistry();
    this._rx.callAt = (blockHash, knownVersion) => (0, _rxjs.from)(this.at(blockHash, knownVersion)).pipe((0, _rxjs.map)(a => a.rx.call));
    this._rx.queryAt = (blockHash, knownVersion) => (0, _rxjs.from)(this.at(blockHash, knownVersion)).pipe((0, _rxjs.map)(a => a.rx.query));
    this._rx.registry = this.#registry;
    const thisProvider = options.source ? options.source._rpcCore.provider.isClonable ? options.source._rpcCore.provider.clone() : options.source._rpcCore.provider : options.provider || new _rpcProvider.WsProvider();
    this._decorateMethod = decorateMethod;
    this._options = options;
    this._type = type;

    // The RPC interface decorates the known interfaces on init
    this._rpcCore = new _rpcCore.RpcCore(this.#instanceId, this.#registry, thisProvider, this._options.rpc);
    this._isConnected = new _rxjs.BehaviorSubject(this._rpcCore.provider.isConnected);
    this._rx.hasSubscriptions = this._rpcCore.provider.hasSubscriptions;
  }
  /**
   * @description Return the current used registry
   */
  get registry() {
    return this.#registry;
  }

  /**
   * @description Creates an instance of a type as registered
   */
  createType(type) {
    for (var _len = arguments.length, params = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      params[_key - 1] = arguments[_key];
    }
    return this.#registry.createType(type, ...params);
  }

  /**
   * @description Register additional user-defined of chain-specific types in the type registry
   */
  registerTypes(types) {
    types && this.#registry.register(types);
  }

  /**
   * @returns `true` if the API operates with subscriptions
   */
  get hasSubscriptions() {
    return this._rpcCore.provider.hasSubscriptions;
  }

  /**
   * @returns `true` if the API decorate multi-key queries
   */
  get supportMulti() {
    return this._rpcCore.provider.hasSubscriptions || !!this._rpcCore.state.queryStorageAt;
  }
  _emptyDecorated(registry, blockHash) {
    return {
      call: {},
      consts: {},
      errors: {},
      events: {},
      query: {},
      registry,
      rx: {
        call: {},
        query: {}
      },
      tx: (0, _submittable.createSubmittable)(this._type, this._rx, this._decorateMethod, registry, blockHash)
    };
  }
  _createDecorated(registry, fromEmpty, decoratedApi, blockHash) {
    if (!decoratedApi) {
      decoratedApi = this._emptyDecorated(registry.registry, blockHash);
    }
    if (fromEmpty || !registry.decoratedMeta) {
      registry.decoratedMeta = (0, _types.expandMetadata)(registry.registry, registry.metadata);
    }
    const runtime = this._decorateCalls(registry, this._decorateMethod, blockHash);
    const runtimeRx = this._decorateCalls(registry, this._rxDecorateMethod, blockHash);
    const storage = this._decorateStorage(registry.decoratedMeta, this._decorateMethod, blockHash);
    const storageRx = this._decorateStorage(registry.decoratedMeta, this._rxDecorateMethod, blockHash);
    (0, _augmentObject.augmentObject)('consts', registry.decoratedMeta.consts, decoratedApi.consts, fromEmpty);
    (0, _augmentObject.augmentObject)('errors', registry.decoratedMeta.errors, decoratedApi.errors, fromEmpty);
    (0, _augmentObject.augmentObject)('events', registry.decoratedMeta.events, decoratedApi.events, fromEmpty);
    (0, _augmentObject.augmentObject)('query', storage, decoratedApi.query, fromEmpty);
    (0, _augmentObject.augmentObject)('query', storageRx, decoratedApi.rx.query, fromEmpty);
    (0, _augmentObject.augmentObject)('call', runtime, decoratedApi.call, fromEmpty);
    (0, _augmentObject.augmentObject)('call', runtimeRx, decoratedApi.rx.call, fromEmpty);
    decoratedApi.findCall = callIndex => (0, _find.findCall)(registry.registry, callIndex);
    decoratedApi.findError = errorIndex => (0, _find.findError)(registry.registry, errorIndex);
    decoratedApi.queryMulti = blockHash ? this._decorateMultiAt(decoratedApi, this._decorateMethod, blockHash) : this._decorateMulti(this._decorateMethod);
    decoratedApi.runtimeVersion = registry.runtimeVersion;
    return {
      createdAt: blockHash,
      decoratedApi,
      decoratedMeta: registry.decoratedMeta
    };
  }
  _injectMetadata(registry) {
    let fromEmpty = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    // clear the decoration, we are redoing it here
    if (fromEmpty || !registry.decoratedApi) {
      registry.decoratedApi = this._emptyDecorated(registry.registry);
    }
    const {
      decoratedApi,
      decoratedMeta
    } = this._createDecorated(registry, fromEmpty, registry.decoratedApi);
    this._call = decoratedApi.call;
    this._consts = decoratedApi.consts;
    this._errors = decoratedApi.errors;
    this._events = decoratedApi.events;
    this._query = decoratedApi.query;
    this._rx.call = decoratedApi.rx.call;
    this._rx.query = decoratedApi.rx.query;
    const tx = this._decorateExtrinsics(decoratedMeta, this._decorateMethod);
    const rxtx = this._decorateExtrinsics(decoratedMeta, this._rxDecorateMethod);
    if (fromEmpty || !this._extrinsics) {
      this._extrinsics = tx;
      this._rx.tx = rxtx;
    } else {
      (0, _augmentObject.augmentObject)('tx', tx, this._extrinsics, false);
      (0, _augmentObject.augmentObject)(null, rxtx, this._rx.tx, false);
    }
    (0, _augmentObject.augmentObject)(null, decoratedMeta.consts, this._rx.consts, fromEmpty);
    this.emit('decorated');
  }

  /**
   * @deprecated
   * backwards compatible endpoint for metadata injection, may be removed in the future (However, it is still useful for testing injection)
   */
  injectMetadata(metadata, fromEmpty, registry) {
    this._injectMetadata({
      counter: 0,
      metadata,
      registry: registry || this.#registry,
      runtimeVersion: this.#registry.createType('RuntimeVersionPartial')
    }, fromEmpty);
  }
  _decorateFunctionMeta(input, output) {
    output.meta = input.meta;
    output.method = input.method;
    output.section = input.section;
    output.toJSON = input.toJSON;
    if (input.callIndex) {
      output.callIndex = input.callIndex;
    }
    return output;
  }

  // Filter all RPC methods based on the results of the rpc_methods call. We do this in the following
  // manner to cater for both old and new:
  //   - when the number of entries are 0, only remove the ones with isOptional (account & contracts)
  //   - when non-zero, remove anything that is not in the array (we don't do this)
  _filterRpc(methods, additional) {
    // add any specific user-base RPCs
    if (Object.keys(additional).length !== 0) {
      this._rpcCore.addUserInterfaces(additional);

      // re-decorate, only adding any new additional interfaces
      this._decorateRpc(this._rpcCore, this._decorateMethod, this._rpc);
      this._decorateRpc(this._rpcCore, this._rxDecorateMethod, this._rx.rpc);
    }

    // extract the actual sections from the methods (this is useful when
    // we try and create mappings to runtime names via a hash mapping)
    const sectionMap = {};
    for (let i = 0; i < methods.length; i++) {
      const [section] = methods[i].split('_');
      sectionMap[section] = true;
    }

    // convert the actual section names into an easy name lookup
    const sections = Object.keys(sectionMap);
    for (let i = 0; i < sections.length; i++) {
      const nameA = (0, _util.stringUpperFirst)(sections[i]);
      const nameB = `${nameA}Api`;
      this._runtimeMap[(0, _utilCrypto.blake2AsHex)(nameA, 64)] = nameA;
      this._runtimeMap[(0, _utilCrypto.blake2AsHex)(nameB, 64)] = nameB;
    }

    // finally we filter the actual methods to expose
    this._filterRpcMethods(methods);
  }
  _filterRpcMethods(exposed) {
    const hasResults = exposed.length !== 0;
    const allKnown = [...this._rpcCore.mapping.entries()];
    const allKeys = [];
    for (let i = 0; i < allKnown.length; i++) {
      const [, {
        alias,
        endpoint,
        method,
        pubsub,
        section
      }] = allKnown[i];
      allKeys.push(`${section}_${method}`);
      if (pubsub) {
        allKeys.push(`${section}_${pubsub[1]}`);
        allKeys.push(`${section}_${pubsub[2]}`);
      }
      if (alias) {
        allKeys.push(...alias);
      }
      if (endpoint) {
        allKeys.push(endpoint);
      }
    }
    const filterKey = k => !allKeys.includes(k);
    const unknown = exposed.filter(filterKey);
    if (unknown.length && !this._options.noInitWarn) {
      l.warn(`RPC methods not decorated: ${unknown.join(', ')}`);
    }

    // loop through all entries we have (populated in decorate) and filter as required
    // only remove when we have results and method missing, or with no results if optional
    for (let i = 0; i < allKnown.length; i++) {
      const [k, {
        method,
        section
      }] = allKnown[i];
      if (hasResults && !exposed.includes(k) && k !== 'rpc_methods') {
        if (this._rpc[section]) {
          delete this._rpc[section][method];
          delete this._rx.rpc[section][method];
        }
      }
    }
  }
  _rpcSubmitter(decorateMethod) {
    var _this = this;
    const method = function (method) {
      for (var _len2 = arguments.length, params = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        params[_key2 - 1] = arguments[_key2];
      }
      return (0, _rxjs.from)(_this._rpcCore.provider.send(method, params));
    };
    return decorateMethod(method);
  }
  _decorateRpc(rpc, decorateMethod) {
    let input = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this._rpcSubmitter(decorateMethod);
    const out = input;
    const decorateFn = (section, method) => {
      const source = rpc[section][method];
      const fn = decorateMethod(source, {
        methodName: method
      });
      fn.meta = source.meta;
      fn.raw = decorateMethod(source.raw, {
        methodName: method
      });
      return fn;
    };
    for (let s = 0; s < rpc.sections.length; s++) {
      const section = rpc.sections[s];
      if (!Object.prototype.hasOwnProperty.call(out, section)) {
        const methods = Object.keys(rpc[section]);
        const decorateInternal = method => decorateFn(section, method);
        for (let m = 0; m < methods.length; m++) {
          const method = methods[m];

          //  skip subscriptions where we have a non-subscribe interface
          if (this.hasSubscriptions || !(method.startsWith('subscribe') || method.startsWith('unsubscribe'))) {
            if (!Object.prototype.hasOwnProperty.call(out, section)) {
              out[section] = {};
            }
            (0, _util.lazyMethod)(out[section], method, decorateInternal);
          }
        }
      }
    }
    return out;
  }

  // add all definition entries
  _addRuntimeDef(result, additional) {
    if (!additional) {
      return;
    }
    const entries = Object.entries(additional);
    for (let j = 0; j < entries.length; j++) {
      const [key, defs] = entries[j];
      if (result[key]) {
        // we have this one already, step through for new versions or
        // new methods and add those as applicable
        for (let k = 0; k < defs.length; k++) {
          const def = defs[k];
          const prev = result[key].find(_ref2 => {
            let {
              version
            } = _ref2;
            return def.version === version;
          });
          if (prev) {
            // interleave the new methods with the old - last definition wins
            (0, _util.objectSpread)(prev.methods, def.methods);
          } else {
            // we don't have this specific version, add it
            result[key].push(def);
          }
        }
      } else {
        // we don't have this runtime definition, add it as-is
        result[key] = defs;
      }
    }
  }

  // extract all runtime definitions
  _getRuntimeDefs(registry, specName) {
    let chain = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
    const result = {};
    const defValues = Object.values(_types.typeDefinitions);

    // options > chain/spec > built-in, apply in reverse order with
    // methods overriding previous definitions (or interleave missing)
    for (let i = 0; i < defValues.length; i++) {
      this._addRuntimeDef(result, defValues[i].runtime);
    }
    this._addRuntimeDef(result, (0, _typesKnown.getSpecRuntime)(registry, chain, specName));
    this._addRuntimeDef(result, this._options.runtime);
    return Object.entries(result);
  }

  // pre-metadata decoration
  _decorateCalls(_ref3, decorateMethod, blockHash) {
    let {
      registry,
      runtimeVersion: {
        apis,
        specName,
        specVersion
      }
    } = _ref3;
    const result = {};
    const named = {};
    const hashes = {};
    const sections = this._getRuntimeDefs(registry, specName, this._runtimeChain);
    const older = [];
    const implName = `${specName.toString()}/${specVersion.toString()}`;
    const hasLogged = this.#runtimeLog[implName] || false;
    this.#runtimeLog[implName] = true;
    for (let i = 0; i < sections.length; i++) {
      const [_section, secs] = sections[i];
      const sectionHash = (0, _utilCrypto.blake2AsHex)(_section, 64);
      const rtApi = apis.find(_ref4 => {
        let [a] = _ref4;
        return a.eq(sectionHash);
      });
      hashes[sectionHash] = true;
      if (rtApi) {
        const all = secs.map(_ref5 => {
          let {
            version
          } = _ref5;
          return version;
        }).sort();
        const sec = secs.find(_ref6 => {
          let {
            version
          } = _ref6;
          return rtApi[1].eq(version);
        });
        if (sec) {
          const section = (0, _util.stringCamelCase)(_section);
          const methods = Object.entries(sec.methods);
          if (methods.length) {
            if (!named[section]) {
              named[section] = {};
            }
            for (let m = 0; m < methods.length; m++) {
              const [_method, def] = methods[m];
              const method = (0, _util.stringCamelCase)(_method);
              named[section][method] = (0, _util.objectSpread)({
                method,
                name: `${_section}_${_method}`,
                section,
                sectionHash
              }, def);
            }
          }
        } else {
          older.push(`${_section}/${rtApi[1].toString()} (${all.join('/')} known)`);
        }
      }
    }

    // find the runtimes that we don't have hashes for
    const notFound = apis.map(_ref7 => {
      let [a, v] = _ref7;
      return [a.toHex(), v.toString()];
    }).filter(_ref8 => {
      let [a] = _ref8;
      return !hashes[a];
    }).map(_ref9 => {
      let [a, v] = _ref9;
      return `${this._runtimeMap[a] || a}/${v}`;
    });
    if (!this._options.noInitWarn && !hasLogged) {
      if (older.length) {
        l.warn(`${implName}: Not decorating runtime apis without matching versions: ${older.join(', ')}`);
      }
      if (notFound.length) {
        l.warn(`${implName}: Not decorating unknown runtime apis: ${notFound.join(', ')}`);
      }
    }
    const stateCall = blockHash ? (name, bytes) => this._rpcCore.state.call(name, bytes, blockHash) : (name, bytes) => this._rpcCore.state.call(name, bytes);
    const lazySection = section => (0, _util.lazyMethods)({}, Object.keys(named[section]), method => this._decorateCall(registry, named[section][method], stateCall, decorateMethod));
    const modules = Object.keys(named);
    for (let i = 0; i < modules.length; i++) {
      (0, _util.lazyMethod)(result, modules[i], lazySection);
    }
    return result;
  }
  _decorateCall(registry, def, stateCall, decorateMethod) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const decorated = decorateMethod(function () {
      for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }
      if (args.length !== def.params.length) {
        throw new Error(`${def.name}:: Expected ${def.params.length} arguments, found ${args.length}`);
      }
      const bytes = registry.createType('Raw', (0, _util.u8aConcatStrict)(args.map((a, i) => registry.createTypeUnsafe(def.params[i].type, [a]).toU8a())));
      return stateCall(def.name, bytes).pipe((0, _rxjs.map)(r => registry.createTypeUnsafe(def.type, [r])));
    });
    decorated.meta = def;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return decorated;
  }

  // only be called if supportMulti is true
  _decorateMulti(decorateMethod) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return decorateMethod(keys => (this.hasSubscriptions ? this._rpcCore.state.subscribeStorage : this._rpcCore.state.queryStorageAt)(keys.map(args => Array.isArray(args) ? args[0].creator.meta.type.isPlain ? [args[0].creator] : args[0].creator.meta.type.asMap.hashers.length === 1 ? [args[0].creator, args.slice(1)] : [args[0].creator, ...args.slice(1)] : [args.creator])));
  }
  _decorateMultiAt(atApi, decorateMethod, blockHash) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return decorateMethod(calls => this._rpcCore.state.queryStorageAt(calls.map(args => {
      if (Array.isArray(args)) {
        const {
          creator
        } = getAtQueryFn(atApi, args[0].creator);
        return creator.meta.type.isPlain ? [creator] : creator.meta.type.asMap.hashers.length === 1 ? [creator, args.slice(1)] : [creator, ...args.slice(1)];
      }
      return [getAtQueryFn(atApi, args.creator).creator];
    }), blockHash));
  }
  _decorateExtrinsics(_ref10, decorateMethod) {
    let {
      tx
    } = _ref10;
    const result = (0, _submittable.createSubmittable)(this._type, this._rx, decorateMethod);
    const lazySection = section => (0, _util.lazyMethods)({}, Object.keys(tx[section]), method => method.startsWith('$') ? tx[section][method] : this._decorateExtrinsicEntry(tx[section][method], result));
    const sections = Object.keys(tx);
    for (let i = 0; i < sections.length; i++) {
      (0, _util.lazyMethod)(result, sections[i], lazySection);
    }
    return result;
  }
  _decorateExtrinsicEntry(method, creator) {
    const decorated = function () {
      return creator(method(...arguments));
    };

    // pass through the `.is`
    decorated.is = other => method.is(other);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._decorateFunctionMeta(method, decorated);
  }
  _decorateStorage(_ref11, decorateMethod, blockHash) {
    let {
      query,
      registry
    } = _ref11;
    const result = {};
    const lazySection = section => (0, _util.lazyMethods)({}, Object.keys(query[section]), method => blockHash ? this._decorateStorageEntryAt(registry, query[section][method], decorateMethod, blockHash) : this._decorateStorageEntry(query[section][method], decorateMethod));
    const sections = Object.keys(query);
    for (let i = 0; i < sections.length; i++) {
      (0, _util.lazyMethod)(result, sections[i], lazySection);
    }
    return result;
  }
  _decorateStorageEntry(creator, decorateMethod) {
    var _this2 = this;
    const getArgs = (args, registry) => (0, _validate.extractStorageArgs)(registry || this.#registry, creator, args);
    const getQueryAt = blockHash => (0, _rxjs.from)(this.at(blockHash)).pipe((0, _rxjs.map)(api => getAtQueryFn(api, creator)));

    // Disable this where it occurs for each field we are decorating
    /* eslint-disable @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment */

    const decorated = this._decorateStorageCall(creator, decorateMethod);
    decorated.creator = creator;
    decorated.at = decorateMethod(function (blockHash) {
      for (var _len4 = arguments.length, args = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
        args[_key4 - 1] = arguments[_key4];
      }
      return getQueryAt(blockHash).pipe((0, _rxjs.switchMap)(q => q(...args)));
    });
    decorated.hash = decorateMethod(function () {
      for (var _len5 = arguments.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
        args[_key5] = arguments[_key5];
      }
      return _this2._rpcCore.state.getStorageHash(getArgs(args));
    });
    decorated.is = key => key.section === creator.section && key.method === creator.method;
    decorated.key = function () {
      return (0, _util.u8aToHex)((0, _util.compactStripLength)(creator(...arguments))[1]);
    };
    decorated.keyPrefix = function () {
      return (0, _util.u8aToHex)(creator.keyPrefix(...arguments));
    };
    decorated.size = decorateMethod(function () {
      for (var _len6 = arguments.length, args = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
        args[_key6] = arguments[_key6];
      }
      return _this2._rpcCore.state.getStorageSize(getArgs(args));
    });
    decorated.sizeAt = decorateMethod(function (blockHash) {
      for (var _len7 = arguments.length, args = new Array(_len7 > 1 ? _len7 - 1 : 0), _key7 = 1; _key7 < _len7; _key7++) {
        args[_key7 - 1] = arguments[_key7];
      }
      return getQueryAt(blockHash).pipe((0, _rxjs.switchMap)(q => _this2._rpcCore.state.getStorageSize(getArgs(args, q.creator.meta.registry), blockHash)));
    });

    // .keys() & .entries() only available on map types
    if (creator.iterKey && creator.meta.type.isMap) {
      decorated.entries = decorateMethod((0, _rpcCore.memo)(this.#instanceId, function () {
        for (var _len8 = arguments.length, args = new Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
          args[_key8] = arguments[_key8];
        }
        return _this2._retrieveMapEntries(creator, null, args);
      }));
      decorated.entriesAt = decorateMethod((0, _rpcCore.memo)(this.#instanceId, function (blockHash) {
        for (var _len9 = arguments.length, args = new Array(_len9 > 1 ? _len9 - 1 : 0), _key9 = 1; _key9 < _len9; _key9++) {
          args[_key9 - 1] = arguments[_key9];
        }
        return getQueryAt(blockHash).pipe((0, _rxjs.switchMap)(q => _this2._retrieveMapEntries(q.creator, blockHash, args)));
      }));
      decorated.entriesPaged = decorateMethod((0, _rpcCore.memo)(this.#instanceId, opts => this._retrieveMapEntriesPaged(creator, undefined, opts)));
      decorated.keys = decorateMethod((0, _rpcCore.memo)(this.#instanceId, function () {
        for (var _len10 = arguments.length, args = new Array(_len10), _key10 = 0; _key10 < _len10; _key10++) {
          args[_key10] = arguments[_key10];
        }
        return _this2._retrieveMapKeys(creator, null, args);
      }));
      decorated.keysAt = decorateMethod((0, _rpcCore.memo)(this.#instanceId, function (blockHash) {
        for (var _len11 = arguments.length, args = new Array(_len11 > 1 ? _len11 - 1 : 0), _key11 = 1; _key11 < _len11; _key11++) {
          args[_key11 - 1] = arguments[_key11];
        }
        return getQueryAt(blockHash).pipe((0, _rxjs.switchMap)(q => _this2._retrieveMapKeys(q.creator, blockHash, args)));
      }));
      decorated.keysPaged = decorateMethod((0, _rpcCore.memo)(this.#instanceId, opts => this._retrieveMapKeysPaged(creator, undefined, opts)));
    }
    if (this.supportMulti && creator.meta.type.isMap) {
      // When using double map storage function, user need to pass double map key as an array
      decorated.multi = decorateMethod(args => creator.meta.type.asMap.hashers.length === 1 ? this._retrieveMulti(args.map(a => [creator, [a]])) : this._retrieveMulti(args.map(a => [creator, a])));
    }

    /* eslint-enable @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment */

    return this._decorateFunctionMeta(creator, decorated);
  }
  _decorateStorageEntryAt(registry, creator, decorateMethod, blockHash) {
    var _this3 = this;
    const getArgs = args => (0, _validate.extractStorageArgs)(registry, creator, args);

    // Disable this where it occurs for each field we are decorating
    /* eslint-disable @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment */

    const decorated = decorateMethod(function () {
      for (var _len12 = arguments.length, args = new Array(_len12), _key12 = 0; _key12 < _len12; _key12++) {
        args[_key12] = arguments[_key12];
      }
      return _this3._rpcCore.state.getStorage(getArgs(args), blockHash);
    });
    decorated.creator = creator;
    decorated.hash = decorateMethod(function () {
      for (var _len13 = arguments.length, args = new Array(_len13), _key13 = 0; _key13 < _len13; _key13++) {
        args[_key13] = arguments[_key13];
      }
      return _this3._rpcCore.state.getStorageHash(getArgs(args), blockHash);
    });
    decorated.is = key => key.section === creator.section && key.method === creator.method;
    decorated.key = function () {
      return (0, _util.u8aToHex)((0, _util.compactStripLength)(creator(...arguments))[1]);
    };
    decorated.keyPrefix = function () {
      return (0, _util.u8aToHex)(creator.keyPrefix(...arguments));
    };
    decorated.size = decorateMethod(function () {
      for (var _len14 = arguments.length, args = new Array(_len14), _key14 = 0; _key14 < _len14; _key14++) {
        args[_key14] = arguments[_key14];
      }
      return _this3._rpcCore.state.getStorageSize(getArgs(args), blockHash);
    });

    // .keys() & .entries() only available on map types
    if (creator.iterKey && creator.meta.type.isMap) {
      decorated.entries = decorateMethod((0, _rpcCore.memo)(this.#instanceId, function () {
        for (var _len15 = arguments.length, args = new Array(_len15), _key15 = 0; _key15 < _len15; _key15++) {
          args[_key15] = arguments[_key15];
        }
        return _this3._retrieveMapEntries(creator, blockHash, args);
      }));
      decorated.entriesPaged = decorateMethod((0, _rpcCore.memo)(this.#instanceId, opts => this._retrieveMapEntriesPaged(creator, blockHash, opts)));
      decorated.keys = decorateMethod((0, _rpcCore.memo)(this.#instanceId, function () {
        for (var _len16 = arguments.length, args = new Array(_len16), _key16 = 0; _key16 < _len16; _key16++) {
          args[_key16] = arguments[_key16];
        }
        return _this3._retrieveMapKeys(creator, blockHash, args);
      }));
      decorated.keysPaged = decorateMethod((0, _rpcCore.memo)(this.#instanceId, opts => this._retrieveMapKeysPaged(creator, blockHash, opts)));
    }
    if (this.supportMulti && creator.meta.type.isMap) {
      // When using double map storage function, user need to pass double map key as an array
      decorated.multi = decorateMethod(args => creator.meta.type.asMap.hashers.length === 1 ? this._retrieveMulti(args.map(a => [creator, [a]]), blockHash) : this._retrieveMulti(args.map(a => [creator, a]), blockHash));
    }

    /* eslint-enable @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment */

    return this._decorateFunctionMeta(creator, decorated);
  }
  _queueStorage(call, queue) {
    const query = queue === this.#storageSubQ ? this._rpcCore.state.subscribeStorage : this._rpcCore.state.queryStorageAt;
    let queueIdx = queue.length - 1;
    let valueIdx = 0;
    let valueObs;

    // if we don't have queue entries yet,
    // or the current queue has fired (see from below),
    // or the current queue has the max entries,
    // then we create a new queue
    if (queueIdx === -1 || !queue[queueIdx] || queue[queueIdx][1].length === PAGE_SIZE_Q) {
      queueIdx++;
      valueObs = (0, _rxjs.from)(
      // we delay the execution until the next tick, this allows
      // any queries made in this timeframe to be added to the same
      // queue for a single query
      new Promise(resolve => {
        (0, _util.nextTick)(() => {
          // get all the calls in this instance, resolve with it
          // and then clear the queue so we don't add more
          // (anyhting after this will be added to a new queue)
          const calls = queue[queueIdx][1];
          delete queue[queueIdx];
          resolve(calls);
        });
      })).pipe((0, _rxjs.switchMap)(calls => query(calls)));
      queue.push([valueObs, [call]]);
    } else {
      valueObs = queue[queueIdx][0];
      valueIdx = queue[queueIdx][1].length;
      queue[queueIdx][1].push(call);
    }
    return valueObs.pipe(
    // return the single value at this index
    (0, _rxjs.map)(values => values[valueIdx]));
  }

  // Decorate the base storage call. In the case or rxjs or promise-without-callback (await)
  // we make a subscription, alternatively we push this through a single-shot query
  _decorateStorageCall(creator, decorateMethod) {
    var _this4 = this;
    return decorateMethod(function () {
      for (var _len17 = arguments.length, args = new Array(_len17), _key17 = 0; _key17 < _len17; _key17++) {
        args[_key17] = arguments[_key17];
      }
      const call = (0, _validate.extractStorageArgs)(_this4.#registry, creator, args);
      if (!_this4.hasSubscriptions) {
        return _this4._rpcCore.state.getStorage(call);
      }
      return _this4._queueStorage(call, _this4.#storageSubQ);
    }, {
      methodName: creator.method,
      overrideNoSub: function () {
        for (var _len18 = arguments.length, args = new Array(_len18), _key18 = 0; _key18 < _len18; _key18++) {
          args[_key18] = arguments[_key18];
        }
        return _this4._queueStorage((0, _validate.extractStorageArgs)(_this4.#registry, creator, args), _this4.#storageGetQ);
      }
    });
  }

  // retrieve a set of values for a specific set of keys - here we chunk the keys into PAGE_SIZE sizes
  _retrieveMulti(keys, blockHash) {
    if (!keys.length) {
      return (0, _rxjs.of)([]);
    }
    const query = this.hasSubscriptions && !blockHash ? this._rpcCore.state.subscribeStorage : this._rpcCore.state.queryStorageAt;
    if (keys.length <= PAGE_SIZE_V) {
      return blockHash ? query(keys, blockHash) : query(keys);
    }
    return (0, _rxjs.combineLatest)((0, _util.arrayChunk)(keys, PAGE_SIZE_V).map(k => blockHash ? query(k, blockHash) : query(k))).pipe((0, _rxjs.map)(_util.arrayFlatten));
  }
  _retrieveMapKeys(_ref12, at, args) {
    let {
      iterKey,
      meta,
      method,
      section
    } = _ref12;
    if (!iterKey || !meta.type.isMap) {
      throw new Error('keys can only be retrieved on maps');
    }
    const headKey = iterKey(...args).toHex();
    const startSubject = new _rxjs.BehaviorSubject(headKey);
    const query = at ? startKey => this._rpcCore.state.getKeysPaged(headKey, PAGE_SIZE_K, startKey, at) : startKey => this._rpcCore.state.getKeysPaged(headKey, PAGE_SIZE_K, startKey);
    const setMeta = key => key.setMeta(meta, section, method);
    return startSubject.pipe((0, _rxjs.switchMap)(query), (0, _rxjs.map)(keys => keys.map(setMeta)), (0, _rxjs.tap)(keys => (0, _util.nextTick)(() => {
      keys.length === PAGE_SIZE_K ? startSubject.next(keys[PAGE_SIZE_K - 1].toHex()) : startSubject.complete();
    })), (0, _rxjs.toArray)(),
    // toArray since we want to startSubject to be completed
    (0, _rxjs.map)(_util.arrayFlatten));
  }
  _retrieveMapKeysPaged(_ref13, at, opts) {
    let {
      iterKey,
      meta,
      method,
      section
    } = _ref13;
    if (!iterKey || !meta.type.isMap) {
      throw new Error('keys can only be retrieved on maps');
    }
    const setMeta = key => key.setMeta(meta, section, method);
    const query = at ? headKey => this._rpcCore.state.getKeysPaged(headKey, opts.pageSize, opts.startKey || headKey, at) : headKey => this._rpcCore.state.getKeysPaged(headKey, opts.pageSize, opts.startKey || headKey);
    return query(iterKey(...opts.args).toHex()).pipe((0, _rxjs.map)(keys => keys.map(setMeta)));
  }
  _retrieveMapEntries(entry, at, args) {
    const query = at ? keys => this._rpcCore.state.queryStorageAt(keys, at) : keys => this._rpcCore.state.queryStorageAt(keys);
    return this._retrieveMapKeys(entry, at, args).pipe((0, _rxjs.switchMap)(keys => keys.length ? (0, _rxjs.combineLatest)((0, _util.arrayChunk)(keys, PAGE_SIZE_V).map(query)).pipe((0, _rxjs.map)(valsArr => (0, _util.arrayFlatten)(valsArr).map((value, index) => [keys[index], value]))) : (0, _rxjs.of)([])));
  }
  _retrieveMapEntriesPaged(entry, at, opts) {
    const query = at ? keys => this._rpcCore.state.queryStorageAt(keys, at) : keys => this._rpcCore.state.queryStorageAt(keys);
    return this._retrieveMapKeysPaged(entry, at, opts).pipe((0, _rxjs.switchMap)(keys => keys.length ? query(keys).pipe((0, _rxjs.map)(valsArr => valsArr.map((value, index) => [keys[index], value]))) : (0, _rxjs.of)([])));
  }
  _decorateDeriveRx(decorateMethod) {
    var _this$_runtimeVersion, _this$_options$typesB, _this$_options$typesB2, _this$_options$typesB3;
    const specName = (_this$_runtimeVersion = this._runtimeVersion) == null ? void 0 : _this$_runtimeVersion.specName.toString();

    // Pull in derive from api-derive
    const available = (0, _apiDerive.getAvailableDerives)(this.#instanceId, this._rx, (0, _util.objectSpread)({}, this._options.derives, (_this$_options$typesB = this._options.typesBundle) == null ? void 0 : (_this$_options$typesB2 = _this$_options$typesB.spec) == null ? void 0 : (_this$_options$typesB3 = _this$_options$typesB2[specName || '']) == null ? void 0 : _this$_options$typesB3.derives));
    return (0, _decorate.decorateDeriveSections)(decorateMethod, available);
  }
  _decorateDerive(decorateMethod) {
    return (0, _decorate.decorateDeriveSections)(decorateMethod, this._rx.derive);
  }

  /**
   * Put the `this.onCall` function of ApiRx here, because it is needed by
   * `api._rx`.
   */
  _rxDecorateMethod = method => {
    return method;
  };
}
exports.Decorate = Decorate;
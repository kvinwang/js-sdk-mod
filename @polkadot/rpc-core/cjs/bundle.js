"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  RpcCore: true,
  packageInfo: true
};
exports.RpcCore = void 0;
Object.defineProperty(exports, "packageInfo", {
  enumerable: true,
  get: function () {
    return _packageInfo.packageInfo;
  }
});
var _rxjs = require("rxjs");
var _types = require("@polkadot/types");
var _util = require("@polkadot/util");
var _util2 = require("./util");
Object.keys(_util2).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _util2[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _util2[key];
    }
  });
});
var _packageInfo = require("./packageInfo");
// Copyright 2017-2022 @polkadot/rpc-core authors & contributors
// SPDX-License-Identifier: Apache-2.0

const l = (0, _util.logger)('rpc-core');
const EMPTY_META = {
  fallback: undefined,
  modifier: {
    isOptional: true
  },
  type: {
    asMap: {
      linked: {
        isTrue: false
      }
    },
    isMap: false
  }
};

// utility method to create a nicely-formatted error
/** @internal */
function logErrorMessage(method, _ref, error) {
  let {
    noErrorLog,
    params,
    type
  } = _ref;
  if (noErrorLog) {
    return;
  }
  const inputs = params.map(_ref2 => {
    let {
      isOptional,
      name,
      type
    } = _ref2;
    return `${name}${isOptional ? '?' : ''}: ${type}`;
  }).join(', ');
  l.error(`${method}(${inputs}): ${type}:: ${error.message}`);
}
function isTreatAsHex(key) {
  // :code is problematic - it does not have the length attached, which is
  // unlike all other storage entries where it is indeed properly encoded
  return ['0x3a636f6465'].includes(key.toHex());
}

/**
 * @name Rpc
 * @summary The API may use a HTTP or WebSockets provider.
 * @description It allows for querying a Polkadot Client Node.
 * WebSockets provider is recommended since HTTP provider only supports basic querying.
 *
 * ```mermaid
 * graph LR;
 *   A[Api] --> |WebSockets| B[WsProvider];
 *   B --> |endpoint| C[ws://127.0.0.1:9944]
 * ```
 *
 * @example
 * <BR>
 *
 * ```javascript
 * import Rpc from '@polkadot/rpc-core';
 * import { WsProvider } from '@polkadot/rpc-provider/ws';
 *
 * const provider = new WsProvider('ws://127.0.0.1:9944');
 * const rpc = new Rpc(provider);
 * ```
 */
class RpcCore {
  #instanceId;
  #registryDefault;
  #getBlockRegistry;
  #getBlockHash;
  #storageCache = new Map();
  mapping = new Map();
  sections = [];

  /**
   * @constructor
   * Default constructor for the Api Object
   * @param  {ProviderInterface} provider An API provider using HTTP or WebSocket
   */
  constructor(instanceId, registry, provider) {
    let userRpc = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    // eslint-disable-next-line @typescript-eslint/unbound-method
    if (!provider || !(0, _util.isFunction)(provider.send)) {
      throw new Error('Expected Provider to API create');
    }
    this.#instanceId = instanceId;
    this.#registryDefault = registry;
    this.provider = provider;
    const sectionNames = Object.keys(_types.rpcDefinitions);

    // these are the base keys (i.e. part of jsonrpc)
    this.sections.push(...sectionNames);

    // decorate all interfaces, defined and user on this instance
    this.addUserInterfaces(userRpc);
  }

  /**
   * @description Returns the connected status of a provider
   */
  get isConnected() {
    return this.provider.isConnected;
  }

  /**
   * @description Manually connect from the attached provider
   */
  connect() {
    return this.provider.connect();
  }

  /**
   * @description Manually disconnect from the attached provider
   */
  disconnect() {
    return this.provider.disconnect();
  }

  /**
   * @description Sets a registry swap (typically from Api)
   */
  setRegistrySwap(registrySwap) {
    this.#getBlockRegistry = (0, _util.memoize)(registrySwap, {
      getInstanceId: () => this.#instanceId
    });
  }

  /**
   * @description Sets a function to resolve block hash from block number
   */
  setResolveBlockHash(resolveBlockHash) {
    this.#getBlockHash = (0, _util.memoize)(resolveBlockHash, {
      getInstanceId: () => this.#instanceId
    });
  }
  addUserInterfaces(userRpc) {
    // add any extra user-defined sections
    this.sections.push(...Object.keys(userRpc).filter(k => !this.sections.includes(k)));
    for (let s = 0; s < this.sections.length; s++) {
      const section = this.sections[s];
      const defs = (0, _util.objectSpread)({}, _types.rpcDefinitions[section], userRpc[section]);
      const methods = Object.keys(defs);
      for (let m = 0; m < methods.length; m++) {
        const method = methods[m];
        const def = defs[method];
        const jsonrpc = def.endpoint || `${section}_${method}`;
        if (!this.mapping.has(jsonrpc)) {
          const isSubscription = !!def.pubsub;
          if (!this[section]) {
            this[section] = {};
          }
          this.mapping.set(jsonrpc, (0, _util.objectSpread)({}, def, {
            isSubscription,
            jsonrpc,
            method,
            section
          }));
          (0, _util.lazyMethod)(this[section], method, () => isSubscription ? this._createMethodSubscribe(section, method, def) : this._createMethodSend(section, method, def));
        }
      }
    }
  }
  _memomize(creator, def) {
    const memoOpts = {
      getInstanceId: () => this.#instanceId
    };
    const memoized = (0, _util.memoize)(creator(true), memoOpts);
    memoized.raw = (0, _util.memoize)(creator(false), memoOpts);
    memoized.meta = def;
    return memoized;
  }
  _formatResult(isScale, registry, blockHash, method, def, params, result) {
    return isScale ? this._formatOutput(registry, blockHash, method, def, params, result) : result;
  }
  _createMethodSend(section, method, def) {
    const rpcName = def.endpoint || `${section}_${method}`;
    const hashIndex = def.params.findIndex(_ref3 => {
      let {
        isHistoric
      } = _ref3;
      return isHistoric;
    });
    let memoized = null;

    // execute the RPC call, doing a registry swap for historic as applicable
    const callWithRegistry = async (isScale, values) => {
      var _this$getBlockHash;
      const blockId = hashIndex === -1 ? null : values[hashIndex];
      const blockHash = blockId && def.params[hashIndex].type === 'BlockNumber' ? await ((_this$getBlockHash = this.#getBlockHash) == null ? void 0 : _this$getBlockHash.call(this, blockId)) : blockId;
      const {
        registry
      } = isScale && blockHash && this.#getBlockRegistry ? await this.#getBlockRegistry((0, _util.u8aToU8a)(blockHash)) : {
        registry: this.#registryDefault
      };
      const params = this._formatInputs(registry, null, def, values);

      // only cache .at(<blockHash>) queries, e.g. where valid blockHash was supplied
      const result = await this.provider.send(rpcName, params.map(p => p.toJSON()), !!blockHash);
      return this._formatResult(isScale, registry, blockHash, method, def, params, result);
    };
    const creator = isScale => function () {
      for (var _len = arguments.length, values = new Array(_len), _key = 0; _key < _len; _key++) {
        values[_key] = arguments[_key];
      }
      const isDelayed = isScale && hashIndex !== -1 && !!values[hashIndex];
      return new _rxjs.Observable(observer => {
        callWithRegistry(isScale, values).then(value => {
          observer.next(value);
          observer.complete();
        }).catch(error => {
          logErrorMessage(method, def, error);
          observer.error(error);
          observer.complete();
        });
        return () => {
          // delete old results from cache
          if (isScale) {
            var _memoized;
            (_memoized = memoized) == null ? void 0 : _memoized.unmemoize(...values);
          } else {
            var _memoized2;
            (_memoized2 = memoized) == null ? void 0 : _memoized2.raw.unmemoize(...values);
          }
        };
      }).pipe((0, _rxjs.publishReplay)(1),
      // create a Replay(1)
      isDelayed ? (0, _util2.refCountDelay)() // Unsubscribe after delay
      : (0, _rxjs.refCount)());
    };
    memoized = this._memomize(creator, def);
    return memoized;
  }

  // create a subscriptor, it subscribes once and resolves with the id as subscribe
  _createSubscriber(_ref4, errorHandler) {
    let {
      paramsJson,
      subName,
      subType,
      update
    } = _ref4;
    return new Promise((resolve, reject) => {
      this.provider.subscribe(subType, subName, paramsJson, update).then(resolve).catch(error => {
        errorHandler(error);
        reject(error);
      });
    });
  }
  _createMethodSubscribe(section, method, def) {
    var _this = this;
    const [updateType, subMethod, unsubMethod] = def.pubsub;
    const subName = `${section}_${subMethod}`;
    const unsubName = `${section}_${unsubMethod}`;
    const subType = `${section}_${updateType}`;
    let memoized = null;
    const creator = isScale => function () {
      for (var _len2 = arguments.length, values = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        values[_key2] = arguments[_key2];
      }
      return new _rxjs.Observable(observer => {
        // Have at least an empty promise, as used in the unsubscribe
        let subscriptionPromise = Promise.resolve(null);
        const registry = _this.#registryDefault;
        const errorHandler = error => {
          logErrorMessage(method, def, error);
          observer.error(error);
        };
        try {
          const params = _this._formatInputs(registry, null, def, values);
          const paramsJson = params.map(p => p.toJSON());
          const update = (error, result) => {
            if (error) {
              logErrorMessage(method, def, error);
              return;
            }
            try {
              observer.next(_this._formatResult(isScale, registry, null, method, def, params, result));
            } catch (error) {
              observer.error(error);
            }
          };
          subscriptionPromise = _this._createSubscriber({
            paramsJson,
            subName,
            subType,
            update
          }, errorHandler);
        } catch (error) {
          errorHandler(error);
        }

        // Teardown logic
        return () => {
          // Delete from cache, so old results don't hang around
          if (isScale) {
            var _memoized3;
            (_memoized3 = memoized) == null ? void 0 : _memoized3.unmemoize(...values);
          } else {
            var _memoized4;
            (_memoized4 = memoized) == null ? void 0 : _memoized4.raw.unmemoize(...values);
          }

          // Unsubscribe from provider
          subscriptionPromise.then(subscriptionId => (0, _util.isNull)(subscriptionId) ? Promise.resolve(false) : _this.provider.unsubscribe(subType, unsubName, subscriptionId)).catch(error => logErrorMessage(method, def, error));
        };
      }).pipe((0, _util2.drr)());
    };
    memoized = this._memomize(creator, def);
    return memoized;
  }
  _formatInputs(registry, blockHash, def, inputs) {
    const reqArgCount = def.params.filter(_ref5 => {
      let {
        isOptional
      } = _ref5;
      return !isOptional;
    }).length;
    const optText = reqArgCount === def.params.length ? '' : ` (${def.params.length - reqArgCount} optional)`;
    if (inputs.length < reqArgCount || inputs.length > def.params.length) {
      throw new Error(`Expected ${def.params.length} parameters${optText}, ${inputs.length} found instead`);
    }
    return inputs.map((input, index) => registry.createTypeUnsafe(def.params[index].type, [input], {
      blockHash
    }));
  }
  _formatOutput(registry, blockHash, method, rpc, params, result) {
    if (rpc.type === 'StorageData') {
      const key = params[0];
      return this._formatStorageData(registry, blockHash, key, result);
    } else if (rpc.type === 'StorageChangeSet') {
      const keys = params[0];
      return keys ? this._formatStorageSet(registry, result.block, keys, result.changes) : registry.createType('StorageChangeSet', result);
    } else if (rpc.type === 'Vec<StorageChangeSet>') {
      const mapped = result.map(_ref6 => {
        let {
          block,
          changes
        } = _ref6;
        return [registry.createType('Hash', block), this._formatStorageSet(registry, block, params[0], changes)];
      });

      // we only query at a specific block, not a range - flatten
      return method === 'queryStorageAt' ? mapped[0][1] : mapped;
    }
    return registry.createTypeUnsafe(rpc.type, [result], {
      blockHash
    });
  }
  _formatStorageData(registry, blockHash, key, value) {
    const isEmpty = (0, _util.isNull)(value);

    // we convert to Uint8Array since it maps to the raw encoding, all
    // data will be correctly encoded (incl. numbers, excl. :code)
    const input = isEmpty ? null : isTreatAsHex(key) ? value : (0, _util.u8aToU8a)(value);
    return this._newType(registry, blockHash, key, input, isEmpty);
  }
  _formatStorageSet(registry, blockHash, keys, changes) {
    // For StorageChangeSet, the changes has the [key, value] mappings
    const withCache = keys.length !== 1;

    // multiple return values (via state.storage subscription), decode the values
    // one at a time, all based on the query types. Three values can be returned -
    //   - Codec - There is a valid value, non-empty
    //   - null - The storage key is empty
    return keys.reduce((results, key, index) => {
      results.push(this._formatStorageSetEntry(registry, blockHash, key, changes, withCache, index));
      return results;
    }, []);
  }
  _formatStorageSetEntry(registry, blockHash, key, changes, withCache, entryIndex) {
    const hexKey = key.toHex();
    const found = changes.find(_ref7 => {
      let [key] = _ref7;
      return key === hexKey;
    });
    const isNotFound = (0, _util.isUndefined)(found);

    // if we don't find the value, this is our fallback
    //   - in the case of an array of values, fill the hole from the cache
    //   - if a single result value, don't fill - it is not an update hole
    //   - fallback to an empty option in all cases
    if (isNotFound && withCache) {
      const cached = this.#storageCache.get(hexKey);
      if (cached) {
        return cached;
      }
    }
    const value = isNotFound ? null : found[1];
    const isEmpty = (0, _util.isNull)(value);
    const input = isEmpty || isTreatAsHex(key) ? value : (0, _util.u8aToU8a)(value);
    const codec = this._newType(registry, blockHash, key, input, isEmpty, entryIndex);

    // store the retrieved result - the only issue with this cache is that there is no
    // clearing of it, so very long running processes (not just a couple of hours, longer)
    // will increase memory beyond what is allowed.
    this.#storageCache.set(hexKey, codec);
    return codec;
  }
  _newType(registry, blockHash, key, input, isEmpty) {
    let entryIndex = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : -1;
    // single return value (via state.getStorage), decode the value based on the
    // outputType that we have specified. Fallback to Raw on nothing
    const type = key.outputType || 'Raw';
    const meta = key.meta || EMPTY_META;
    const entryNum = entryIndex === -1 ? '' : ` entry ${entryIndex}:`;
    try {
      return registry.createTypeUnsafe(type, [isEmpty ? meta.fallback
      // For old-style Linkage, we add an empty linkage at the end
      ? type.includes('Linkage<') ? (0, _util.u8aConcat)((0, _util.hexToU8a)(meta.fallback.toHex()), new Uint8Array(2)) : (0, _util.hexToU8a)(meta.fallback.toHex()) : undefined : meta.modifier.isOptional ? registry.createTypeUnsafe(type, [input], {
        blockHash,
        isPedantic: true
      }) : input], {
        blockHash,
        isOptional: meta.modifier.isOptional,
        isPedantic: !meta.modifier.isOptional
      });
    } catch (error) {
      throw new Error(`Unable to decode storage ${key.section || 'unknown'}.${key.method || 'unknown'}:${entryNum}: ${error.message}`);
    }
  }
}
exports.RpcCore = RpcCore;
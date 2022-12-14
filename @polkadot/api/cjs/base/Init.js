"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Init = void 0;
var _classPrivateFieldLooseBase2 = _interopRequireDefault(require("@babel/runtime/helpers/classPrivateFieldLooseBase"));
var _classPrivateFieldLooseKey2 = _interopRequireDefault(require("@babel/runtime/helpers/classPrivateFieldLooseKey"));
var _rxjs = require("rxjs");
var _types = require("@polkadot/types");
var _typesKnown = require("@polkadot/types-known");
var _util = require("@polkadot/util");
var _utilCrypto = require("@polkadot/util-crypto");
var _Decorate = require("./Decorate");
// Copyright 2017-2022 @polkadot/api authors & contributors
// SPDX-License-Identifier: Apache-2.0

const KEEPALIVE_INTERVAL = 10000;
const WITH_VERSION_SHORTCUT = false;
const l = (0, _util.logger)('api/init');
function textToString(t) {
  return t.toString();
}
var _atLast = /*#__PURE__*/(0, _classPrivateFieldLooseKey2.default)("atLast");
var _healthTimer = /*#__PURE__*/(0, _classPrivateFieldLooseKey2.default)("healthTimer");
var _registries = /*#__PURE__*/(0, _classPrivateFieldLooseKey2.default)("registries");
var _updateSub = /*#__PURE__*/(0, _classPrivateFieldLooseKey2.default)("updateSub");
var _waitingRegistries = /*#__PURE__*/(0, _classPrivateFieldLooseKey2.default)("waitingRegistries");
var _onProviderConnect = /*#__PURE__*/(0, _classPrivateFieldLooseKey2.default)("onProviderConnect");
var _onProviderDisconnect = /*#__PURE__*/(0, _classPrivateFieldLooseKey2.default)("onProviderDisconnect");
var _onProviderError = /*#__PURE__*/(0, _classPrivateFieldLooseKey2.default)("onProviderError");
class Init extends _Decorate.Decorate {
  constructor(options, type, decorateMethod) {
    super(options, type, decorateMethod);

    // all injected types added to the registry for overrides
    Object.defineProperty(this, _onProviderError, {
      value: _onProviderError2
    });
    Object.defineProperty(this, _onProviderDisconnect, {
      value: _onProviderDisconnect2
    });
    Object.defineProperty(this, _onProviderConnect, {
      value: _onProviderConnect2
    });
    Object.defineProperty(this, _atLast, {
      writable: true,
      value: null
    });
    Object.defineProperty(this, _healthTimer, {
      writable: true,
      value: null
    });
    Object.defineProperty(this, _registries, {
      writable: true,
      value: []
    });
    Object.defineProperty(this, _updateSub, {
      writable: true,
      value: null
    });
    Object.defineProperty(this, _waitingRegistries, {
      writable: true,
      value: {}
    });
    this.registry.setKnownTypes(options);

    // We only register the types (global) if this is not a cloned instance.
    // Do right up-front, so we get in the user types before we are actually
    // doing anything on-chain, this ensures we have the overrides in-place
    if (!options.source) {
      this.registerTypes(options.types);
    } else {
      (0, _classPrivateFieldLooseBase2.default)(this, _registries)[_registries] = (0, _classPrivateFieldLooseBase2.default)(options.source, _registries)[_registries];
    }
    this._rpc = this._decorateRpc(this._rpcCore, this._decorateMethod);
    this._rx.rpc = this._decorateRpc(this._rpcCore, this._rxDecorateMethod);
    if (this.supportMulti) {
      this._queryMulti = this._decorateMulti(this._decorateMethod);
      this._rx.queryMulti = this._decorateMulti(this._rxDecorateMethod);
    }
    this._rx.signer = options.signer;
    this._rpcCore.setRegistrySwap(blockHash => this.getBlockRegistry(blockHash));
    this._rpcCore.setResolveBlockHash(blockNumber => (0, _rxjs.firstValueFrom)(this._rpcCore.chain.getBlockHash(blockNumber)));
    if (this.hasSubscriptions) {
      this._rpcCore.provider.on('disconnected', () => (0, _classPrivateFieldLooseBase2.default)(this, _onProviderDisconnect)[_onProviderDisconnect]());
      this._rpcCore.provider.on('error', e => (0, _classPrivateFieldLooseBase2.default)(this, _onProviderError)[_onProviderError](e));
      this._rpcCore.provider.on('connected', () => (0, _classPrivateFieldLooseBase2.default)(this, _onProviderConnect)[_onProviderConnect]());
    } else if (!this._options.noInitWarn) {
      l.warn('Api will be available in a limited mode since the provider does not support subscriptions');
    }

    // If the provider was instantiated earlier, and has already emitted a
    // 'connected' event, then the `on('connected')` won't fire anymore. To
    // cater for this case, we call manually `this._onProviderConnect`.
    if (this._rpcCore.provider.isConnected) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      (0, _classPrivateFieldLooseBase2.default)(this, _onProviderConnect)[_onProviderConnect]();
    }
  }

  /**
   * @description Decorates a registry based on the runtime version
   */
  _initRegistry(registry, chain, version, metadata, chainProps) {
    registry.clearCache();
    registry.setChainProperties(chainProps || this.registry.getChainProperties());
    registry.setKnownTypes(this._options);
    registry.register((0, _typesKnown.getSpecTypes)(registry, chain, version.specName, version.specVersion));
    registry.setHasher((0, _typesKnown.getSpecHasher)(registry, chain, version.specName));

    // for bundled types, pull through the aliases defined
    if (registry.knownTypes.typesBundle) {
      registry.knownTypes.typesAlias = (0, _typesKnown.getSpecAlias)(registry, chain, version.specName);
    }
    registry.setMetadata(metadata, undefined, (0, _util.objectSpread)({}, (0, _typesKnown.getSpecExtensions)(registry, chain, version.specName), this._options.signedExtensions));
  }

  /**
   * @description Returns the default versioned registry
   */
  _getDefaultRegistry() {
    return (0, _util.assertReturn)((0, _classPrivateFieldLooseBase2.default)(this, _registries)[_registries].find(_ref => {
      let {
        isDefault
      } = _ref;
      return isDefault;
    }), 'Initialization error, cannot find the default registry');
  }

  /**
   * @description Returns a decorated API instance at a specific point in time
   */
  async at(blockHash, knownVersion) {
    const u8aHash = (0, _util.u8aToU8a)(blockHash);
    const u8aHex = (0, _util.u8aToHex)(u8aHash);
    const registry = await this.getBlockRegistry(u8aHash, knownVersion);
    if (!(0, _classPrivateFieldLooseBase2.default)(this, _atLast)[_atLast] || (0, _classPrivateFieldLooseBase2.default)(this, _atLast)[_atLast][0] !== u8aHex) {
      // always create a new decoration - since we are pointing to a specific hash, this
      // means that all queries needs to use that hash (not a previous one already existing)
      (0, _classPrivateFieldLooseBase2.default)(this, _atLast)[_atLast] = [u8aHex, this._createDecorated(registry, true, null, u8aHash).decoratedApi];
    }
    return (0, _classPrivateFieldLooseBase2.default)(this, _atLast)[_atLast][1];
  }
  async _createBlockRegistry(blockHash, header, version) {
    const registry = new _types.TypeRegistry(blockHash);
    const metadata = new _types.Metadata(registry, await (0, _rxjs.firstValueFrom)(this._rpcCore.state.getMetadata.raw(header.parentHash)));
    this._initRegistry(registry, this._runtimeChain, version, metadata);

    // add our new registry
    const result = {
      counter: 0,
      lastBlockHash: blockHash,
      metadata,
      registry,
      runtimeVersion: version
    };
    (0, _classPrivateFieldLooseBase2.default)(this, _registries)[_registries].push(result);
    return result;
  }
  _cacheBlockRegistryProgress(key, creator) {
    // look for waiting resolves
    let waiting = (0, _classPrivateFieldLooseBase2.default)(this, _waitingRegistries)[_waitingRegistries][key];
    if ((0, _util.isUndefined)(waiting)) {
      // nothing waiting, construct new
      waiting = (0, _classPrivateFieldLooseBase2.default)(this, _waitingRegistries)[_waitingRegistries][key] = new Promise((resolve, reject) => {
        creator().then(registry => {
          delete (0, _classPrivateFieldLooseBase2.default)(this, _waitingRegistries)[_waitingRegistries][key];
          resolve(registry);
        }).catch(error => {
          delete (0, _classPrivateFieldLooseBase2.default)(this, _waitingRegistries)[_waitingRegistries][key];
          reject(error);
        });
      });
    }
    return waiting;
  }
  _getBlockRegistryViaVersion(blockHash, version) {
    if (version) {
      // check for pre-existing registries. We also check specName, e.g. it
      // could be changed like in Westmint with upgrade from shell -> westmint
      const existingViaVersion = (0, _classPrivateFieldLooseBase2.default)(this, _registries)[_registries].find(_ref2 => {
        let {
          runtimeVersion: {
            specName,
            specVersion
          }
        } = _ref2;
        return specName.eq(version.specName) && specVersion.eq(version.specVersion);
      });
      if (existingViaVersion) {
        existingViaVersion.counter++;
        existingViaVersion.lastBlockHash = blockHash;
        return existingViaVersion;
      }
    }
    return null;
  }
  async _getBlockRegistryViaHash(blockHash) {
    // ensure we have everything required
    if (!this._genesisHash || !this._runtimeVersion) {
      throw new Error('Cannot retrieve data on an uninitialized chain');
    }

    // We have to assume that on the RPC layer the calls used here does not call back into
    // the registry swap, so getHeader & getRuntimeVersion should not be historic
    const header = this.registry.createType('HeaderPartial', this._genesisHash.eq(blockHash) ? {
      number: _util.BN_ZERO,
      parentHash: this._genesisHash
    } : await (0, _rxjs.firstValueFrom)(this._rpcCore.chain.getHeader.raw(blockHash)));
    if (header.parentHash.isEmpty) {
      throw new Error('Unable to retrieve header and parent from supplied hash');
    }

    // get the runtime version, either on-chain or via an known upgrade history
    const [firstVersion, lastVersion] = (0, _typesKnown.getUpgradeVersion)(this._genesisHash, header.number);
    const version = this.registry.createType('RuntimeVersionPartial', WITH_VERSION_SHORTCUT && firstVersion && (lastVersion || firstVersion.specVersion.eq(this._runtimeVersion.specVersion)) ? {
      apis: firstVersion.apis,
      specName: this._runtimeVersion.specName,
      specVersion: firstVersion.specVersion
    } : await (0, _rxjs.firstValueFrom)(this._rpcCore.state.getRuntimeVersion.raw(header.parentHash)));
    return (
      // try to find via version
      this._getBlockRegistryViaVersion(blockHash, version) || (
      // return new or in-flight result
      await this._cacheBlockRegistryProgress(version.toHex(), () => this._createBlockRegistry(blockHash, header, version)))
    );
  }

  /**
   * @description Sets up a registry based on the block hash defined
   */
  async getBlockRegistry(blockHash, knownVersion) {
    return (
      // try to find via blockHash
      (0, _classPrivateFieldLooseBase2.default)(this, _registries)[_registries].find(_ref3 => {
        let {
          lastBlockHash
        } = _ref3;
        return lastBlockHash && (0, _util.u8aEq)(lastBlockHash, blockHash);
      }) ||
      // try to find via version
      this._getBlockRegistryViaVersion(blockHash, knownVersion) || (
      // return new or in-flight result
      await this._cacheBlockRegistryProgress((0, _util.u8aToHex)(blockHash), () => this._getBlockRegistryViaHash(blockHash)))
    );
  }
  async _loadMeta() {
    var _this$_options$source;
    // on re-connection to the same chain, we don't want to re-do everything from chain again
    if (this._isReady) {
      return true;
    }
    this._unsubscribeUpdates();

    // only load from on-chain if we are not a clone (default path), alternatively
    // just use the values from the source instance provided
    [this._genesisHash, this._runtimeMetadata] = (_this$_options$source = this._options.source) != null && _this$_options$source._isReady ? await this._metaFromSource(this._options.source) : await this._metaFromChain(this._options.metadata);
    return this._initFromMeta(this._runtimeMetadata);
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async _metaFromSource(source) {
    this._extrinsicType = source.extrinsicVersion;
    this._runtimeChain = source.runtimeChain;
    this._runtimeVersion = source.runtimeVersion;

    // manually build a list of all available methods in this RPC, we are
    // going to filter on it to align the cloned RPC without making a call
    const sections = Object.keys(source.rpc);
    const rpcs = [];
    for (let s = 0; s < sections.length; s++) {
      const section = sections[s];
      const methods = Object.keys(source.rpc[section]);
      for (let m = 0; m < methods.length; m++) {
        rpcs.push(`${section}_${methods[m]}`);
      }
    }
    this._filterRpc(rpcs, (0, _typesKnown.getSpecRpc)(this.registry, source.runtimeChain, source.runtimeVersion.specName));
    return [source.genesisHash, source.runtimeMetadata];
  }

  // subscribe to metadata updates, inject the types on changes
  _subscribeUpdates() {
    if ((0, _classPrivateFieldLooseBase2.default)(this, _updateSub)[_updateSub] || !this.hasSubscriptions) {
      return;
    }
    (0, _classPrivateFieldLooseBase2.default)(this, _updateSub)[_updateSub] = this._rpcCore.state.subscribeRuntimeVersion().pipe((0, _rxjs.switchMap)(version => {
      var _this$_runtimeVersion;
      return (
        // only retrieve the metadata when the on-chain version has been changed
        (_this$_runtimeVersion = this._runtimeVersion) != null && _this$_runtimeVersion.specVersion.eq(version.specVersion) ? (0, _rxjs.of)(false) : this._rpcCore.state.getMetadata().pipe((0, _rxjs.map)(metadata => {
          l.log(`Runtime version updated to spec=${version.specVersion.toString()}, tx=${version.transactionVersion.toString()}`);
          this._runtimeMetadata = metadata;
          this._runtimeVersion = version;
          this._rx.runtimeVersion = version;

          // update the default registry version
          const thisRegistry = this._getDefaultRegistry();

          // setup the data as per the current versions
          thisRegistry.metadata = metadata;
          thisRegistry.runtimeVersion = version;
          this._initRegistry(this.registry, this._runtimeChain, version, metadata);
          this._injectMetadata(thisRegistry, true);
          return true;
        }))
      );
    })).subscribe();
  }
  async _metaFromChain(optMetadata) {
    const [genesisHash, runtimeVersion, chain, chainProps, rpcMethods, chainMetadata] = await Promise.all([(0, _rxjs.firstValueFrom)(this._rpcCore.chain.getBlockHash(0)), (0, _rxjs.firstValueFrom)(this._rpcCore.state.getRuntimeVersion()), (0, _rxjs.firstValueFrom)(this._rpcCore.system.chain()), (0, _rxjs.firstValueFrom)(this._rpcCore.system.properties()), (0, _rxjs.firstValueFrom)(this._rpcCore.rpc.methods()), optMetadata ? Promise.resolve(null) : (0, _rxjs.firstValueFrom)(this._rpcCore.state.getMetadata())]);

    // set our chain version & genesisHash as returned
    this._runtimeChain = chain;
    this._runtimeVersion = runtimeVersion;
    this._rx.runtimeVersion = runtimeVersion;

    // retrieve metadata, either from chain  or as pass-in via options
    const metadataKey = `${genesisHash.toHex() || '0x'}-${runtimeVersion.specVersion.toString()}`;
    const metadata = chainMetadata || (optMetadata && optMetadata[metadataKey] ? new _types.Metadata(this.registry, optMetadata[metadataKey]) : await (0, _rxjs.firstValueFrom)(this._rpcCore.state.getMetadata()));

    // initializes the registry & RPC
    this._initRegistry(this.registry, chain, runtimeVersion, metadata, chainProps);
    this._filterRpc(rpcMethods.methods.map(textToString), (0, _typesKnown.getSpecRpc)(this.registry, chain, runtimeVersion.specName));
    this._subscribeUpdates();

    // setup the initial registry, when we have none
    if (!(0, _classPrivateFieldLooseBase2.default)(this, _registries)[_registries].length) {
      (0, _classPrivateFieldLooseBase2.default)(this, _registries)[_registries].push({
        counter: 0,
        isDefault: true,
        metadata,
        registry: this.registry,
        runtimeVersion
      });
    }

    // get unique types & validate
    metadata.getUniqTypes(this._options.throwOnUnknown || false);
    return [genesisHash, metadata];
  }
  _initFromMeta(metadata) {
    this._extrinsicType = metadata.asLatest.extrinsic.version.toNumber();
    this._rx.extrinsicType = this._extrinsicType;
    this._rx.genesisHash = this._genesisHash;
    this._rx.runtimeVersion = this._runtimeVersion; // must be set here

    // inject metadata and adjust the types as detected
    this._injectMetadata(this._getDefaultRegistry(), true);

    // derive is last, since it uses the decorated rx
    this._rx.derive = this._decorateDeriveRx(this._rxDecorateMethod);
    this._derive = this._decorateDerive(this._decorateMethod);
    return true;
  }
  _subscribeHealth() {
    // Only enable the health keepalive on WS, not needed on HTTP
    (0, _classPrivateFieldLooseBase2.default)(this, _healthTimer)[_healthTimer] = this.hasSubscriptions ? setInterval(() => {
      (0, _rxjs.firstValueFrom)(this._rpcCore.system.health.raw()).catch(() => undefined);
    }, KEEPALIVE_INTERVAL) : null;
  }
  _unsubscribeHealth() {
    if ((0, _classPrivateFieldLooseBase2.default)(this, _healthTimer)[_healthTimer]) {
      clearInterval((0, _classPrivateFieldLooseBase2.default)(this, _healthTimer)[_healthTimer]);
      (0, _classPrivateFieldLooseBase2.default)(this, _healthTimer)[_healthTimer] = null;
    }
  }
  _unsubscribeUpdates() {
    if ((0, _classPrivateFieldLooseBase2.default)(this, _updateSub)[_updateSub]) {
      (0, _classPrivateFieldLooseBase2.default)(this, _updateSub)[_updateSub].unsubscribe();
      (0, _classPrivateFieldLooseBase2.default)(this, _updateSub)[_updateSub] = null;
    }
  }
  _unsubscribe() {
    this._unsubscribeHealth();
    this._unsubscribeUpdates();
  }
}
exports.Init = Init;
async function _onProviderConnect2() {
  this._isConnected.next(true);
  this.emit('connected');
  try {
    const cryptoReady = this._options.initWasm === false ? true : await (0, _utilCrypto.cryptoWaitReady)();
    const hasMeta = await this._loadMeta();
    this._subscribeHealth();
    if (hasMeta && !this._isReady && cryptoReady) {
      this._isReady = true;
      this.emit('ready', this);
    }
  } catch (_error) {
    const error = new Error(`FATAL: Unable to initialize the API: ${_error.message}`);
    l.error(error);
    this.emit('error', error);
  }
}
function _onProviderDisconnect2() {
  this._isConnected.next(false);
  this._unsubscribeHealth();
  this.emit('disconnected');
}
function _onProviderError2(error) {
  this.emit('error', error);
}
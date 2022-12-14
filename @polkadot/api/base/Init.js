import _classPrivateFieldLooseBase from "@babel/runtime/helpers/esm/classPrivateFieldLooseBase";
import _classPrivateFieldLooseKey from "@babel/runtime/helpers/esm/classPrivateFieldLooseKey";
// Copyright 2017-2022 @polkadot/api authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { firstValueFrom, map, of, switchMap } from 'rxjs';
import { Metadata, TypeRegistry } from '@polkadot/types';
import { getSpecAlias, getSpecExtensions, getSpecHasher, getSpecRpc, getSpecTypes, getUpgradeVersion } from '@polkadot/types-known';
import { assertReturn, BN_ZERO, isUndefined, logger, objectSpread, u8aEq, u8aToHex, u8aToU8a } from '@polkadot/util';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import { Decorate } from "./Decorate.js";
const KEEPALIVE_INTERVAL = 10000;
const WITH_VERSION_SHORTCUT = false;
const l = logger('api/init');
function textToString(t) {
  return t.toString();
}
var _atLast = /*#__PURE__*/_classPrivateFieldLooseKey("atLast");
var _healthTimer = /*#__PURE__*/_classPrivateFieldLooseKey("healthTimer");
var _registries = /*#__PURE__*/_classPrivateFieldLooseKey("registries");
var _updateSub = /*#__PURE__*/_classPrivateFieldLooseKey("updateSub");
var _waitingRegistries = /*#__PURE__*/_classPrivateFieldLooseKey("waitingRegistries");
var _onProviderConnect = /*#__PURE__*/_classPrivateFieldLooseKey("onProviderConnect");
var _onProviderDisconnect = /*#__PURE__*/_classPrivateFieldLooseKey("onProviderDisconnect");
var _onProviderError = /*#__PURE__*/_classPrivateFieldLooseKey("onProviderError");
export class Init extends Decorate {
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
      _classPrivateFieldLooseBase(this, _registries)[_registries] = _classPrivateFieldLooseBase(options.source, _registries)[_registries];
    }
    this._rpc = this._decorateRpc(this._rpcCore, this._decorateMethod);
    this._rx.rpc = this._decorateRpc(this._rpcCore, this._rxDecorateMethod);
    if (this.supportMulti) {
      this._queryMulti = this._decorateMulti(this._decorateMethod);
      this._rx.queryMulti = this._decorateMulti(this._rxDecorateMethod);
    }
    this._rx.signer = options.signer;
    this._rpcCore.setRegistrySwap(blockHash => this.getBlockRegistry(blockHash));
    this._rpcCore.setResolveBlockHash(blockNumber => firstValueFrom(this._rpcCore.chain.getBlockHash(blockNumber)));
    if (this.hasSubscriptions) {
      this._rpcCore.provider.on('disconnected', () => _classPrivateFieldLooseBase(this, _onProviderDisconnect)[_onProviderDisconnect]());
      this._rpcCore.provider.on('error', e => _classPrivateFieldLooseBase(this, _onProviderError)[_onProviderError](e));
      this._rpcCore.provider.on('connected', () => _classPrivateFieldLooseBase(this, _onProviderConnect)[_onProviderConnect]());
    } else if (!this._options.noInitWarn) {
      l.warn('Api will be available in a limited mode since the provider does not support subscriptions');
    }

    // If the provider was instantiated earlier, and has already emitted a
    // 'connected' event, then the `on('connected')` won't fire anymore. To
    // cater for this case, we call manually `this._onProviderConnect`.
    if (this._rpcCore.provider.isConnected) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      _classPrivateFieldLooseBase(this, _onProviderConnect)[_onProviderConnect]();
    }
  }

  /**
   * @description Decorates a registry based on the runtime version
   */
  _initRegistry(registry, chain, version, metadata, chainProps) {
    registry.clearCache();
    registry.setChainProperties(chainProps || this.registry.getChainProperties());
    registry.setKnownTypes(this._options);
    registry.register(getSpecTypes(registry, chain, version.specName, version.specVersion));
    registry.setHasher(getSpecHasher(registry, chain, version.specName));

    // for bundled types, pull through the aliases defined
    if (registry.knownTypes.typesBundle) {
      registry.knownTypes.typesAlias = getSpecAlias(registry, chain, version.specName);
    }
    registry.setMetadata(metadata, undefined, objectSpread({}, getSpecExtensions(registry, chain, version.specName), this._options.signedExtensions));
  }

  /**
   * @description Returns the default versioned registry
   */
  _getDefaultRegistry() {
    return assertReturn(_classPrivateFieldLooseBase(this, _registries)[_registries].find(({
      isDefault
    }) => isDefault), 'Initialization error, cannot find the default registry');
  }

  /**
   * @description Returns a decorated API instance at a specific point in time
   */
  async at(blockHash, knownVersion) {
    const u8aHash = u8aToU8a(blockHash);
    const u8aHex = u8aToHex(u8aHash);
    const registry = await this.getBlockRegistry(u8aHash, knownVersion);
    if (!_classPrivateFieldLooseBase(this, _atLast)[_atLast] || _classPrivateFieldLooseBase(this, _atLast)[_atLast][0] !== u8aHex) {
      // always create a new decoration - since we are pointing to a specific hash, this
      // means that all queries needs to use that hash (not a previous one already existing)
      _classPrivateFieldLooseBase(this, _atLast)[_atLast] = [u8aHex, this._createDecorated(registry, true, null, u8aHash).decoratedApi];
    }
    return _classPrivateFieldLooseBase(this, _atLast)[_atLast][1];
  }
  async _createBlockRegistry(blockHash, header, version) {
    const registry = new TypeRegistry(blockHash);
    const metadata = new Metadata(registry, await firstValueFrom(this._rpcCore.state.getMetadata.raw(header.parentHash)));
    this._initRegistry(registry, this._runtimeChain, version, metadata);

    // add our new registry
    const result = {
      counter: 0,
      lastBlockHash: blockHash,
      metadata,
      registry,
      runtimeVersion: version
    };
    _classPrivateFieldLooseBase(this, _registries)[_registries].push(result);
    return result;
  }
  _cacheBlockRegistryProgress(key, creator) {
    // look for waiting resolves
    let waiting = _classPrivateFieldLooseBase(this, _waitingRegistries)[_waitingRegistries][key];
    if (isUndefined(waiting)) {
      // nothing waiting, construct new
      waiting = _classPrivateFieldLooseBase(this, _waitingRegistries)[_waitingRegistries][key] = new Promise((resolve, reject) => {
        creator().then(registry => {
          delete _classPrivateFieldLooseBase(this, _waitingRegistries)[_waitingRegistries][key];
          resolve(registry);
        }).catch(error => {
          delete _classPrivateFieldLooseBase(this, _waitingRegistries)[_waitingRegistries][key];
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
      const existingViaVersion = _classPrivateFieldLooseBase(this, _registries)[_registries].find(({
        runtimeVersion: {
          specName,
          specVersion
        }
      }) => specName.eq(version.specName) && specVersion.eq(version.specVersion));
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
      number: BN_ZERO,
      parentHash: this._genesisHash
    } : await firstValueFrom(this._rpcCore.chain.getHeader.raw(blockHash)));
    if (header.parentHash.isEmpty) {
      throw new Error('Unable to retrieve header and parent from supplied hash');
    }

    // get the runtime version, either on-chain or via an known upgrade history
    const [firstVersion, lastVersion] = getUpgradeVersion(this._genesisHash, header.number);
    const version = this.registry.createType('RuntimeVersionPartial', WITH_VERSION_SHORTCUT && firstVersion && (lastVersion || firstVersion.specVersion.eq(this._runtimeVersion.specVersion)) ? {
      apis: firstVersion.apis,
      specName: this._runtimeVersion.specName,
      specVersion: firstVersion.specVersion
    } : await firstValueFrom(this._rpcCore.state.getRuntimeVersion.raw(header.parentHash)));
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
      _classPrivateFieldLooseBase(this, _registries)[_registries].find(({
        lastBlockHash
      }) => lastBlockHash && u8aEq(lastBlockHash, blockHash)) ||
      // try to find via version
      this._getBlockRegistryViaVersion(blockHash, knownVersion) || (
      // return new or in-flight result
      await this._cacheBlockRegistryProgress(u8aToHex(blockHash), () => this._getBlockRegistryViaHash(blockHash)))
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
    this._filterRpc(rpcs, getSpecRpc(this.registry, source.runtimeChain, source.runtimeVersion.specName));
    return [source.genesisHash, source.runtimeMetadata];
  }

  // subscribe to metadata updates, inject the types on changes
  _subscribeUpdates() {
    if (_classPrivateFieldLooseBase(this, _updateSub)[_updateSub] || !this.hasSubscriptions) {
      return;
    }
    _classPrivateFieldLooseBase(this, _updateSub)[_updateSub] = this._rpcCore.state.subscribeRuntimeVersion().pipe(switchMap(version => {
      var _this$_runtimeVersion;
      return (
        // only retrieve the metadata when the on-chain version has been changed
        (_this$_runtimeVersion = this._runtimeVersion) != null && _this$_runtimeVersion.specVersion.eq(version.specVersion) ? of(false) : this._rpcCore.state.getMetadata().pipe(map(metadata => {
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
    const [genesisHash, runtimeVersion, chain, chainProps, rpcMethods, chainMetadata] = await Promise.all([firstValueFrom(this._rpcCore.chain.getBlockHash(0)), firstValueFrom(this._rpcCore.state.getRuntimeVersion()), firstValueFrom(this._rpcCore.system.chain()), firstValueFrom(this._rpcCore.system.properties()), firstValueFrom(this._rpcCore.rpc.methods()), optMetadata ? Promise.resolve(null) : firstValueFrom(this._rpcCore.state.getMetadata())]);

    // set our chain version & genesisHash as returned
    this._runtimeChain = chain;
    this._runtimeVersion = runtimeVersion;
    this._rx.runtimeVersion = runtimeVersion;

    // retrieve metadata, either from chain  or as pass-in via options
    const metadataKey = `${genesisHash.toHex() || '0x'}-${runtimeVersion.specVersion.toString()}`;
    const metadata = chainMetadata || (optMetadata && optMetadata[metadataKey] ? new Metadata(this.registry, optMetadata[metadataKey]) : await firstValueFrom(this._rpcCore.state.getMetadata()));

    // initializes the registry & RPC
    this._initRegistry(this.registry, chain, runtimeVersion, metadata, chainProps);
    this._filterRpc(rpcMethods.methods.map(textToString), getSpecRpc(this.registry, chain, runtimeVersion.specName));
    this._subscribeUpdates();

    // setup the initial registry, when we have none
    if (!_classPrivateFieldLooseBase(this, _registries)[_registries].length) {
      _classPrivateFieldLooseBase(this, _registries)[_registries].push({
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
    _classPrivateFieldLooseBase(this, _healthTimer)[_healthTimer] = this.hasSubscriptions ? setInterval(() => {
      firstValueFrom(this._rpcCore.system.health.raw()).catch(() => undefined);
    }, KEEPALIVE_INTERVAL) : null;
  }
  _unsubscribeHealth() {
    if (_classPrivateFieldLooseBase(this, _healthTimer)[_healthTimer]) {
      clearInterval(_classPrivateFieldLooseBase(this, _healthTimer)[_healthTimer]);
      _classPrivateFieldLooseBase(this, _healthTimer)[_healthTimer] = null;
    }
  }
  _unsubscribeUpdates() {
    if (_classPrivateFieldLooseBase(this, _updateSub)[_updateSub]) {
      _classPrivateFieldLooseBase(this, _updateSub)[_updateSub].unsubscribe();
      _classPrivateFieldLooseBase(this, _updateSub)[_updateSub] = null;
    }
  }
  _unsubscribe() {
    this._unsubscribeHealth();
    this._unsubscribeUpdates();
  }
}
async function _onProviderConnect2() {
  this._isConnected.next(true);
  this.emit('connected');
  try {
    const cryptoReady = this._options.initWasm === false ? true : await cryptoWaitReady();
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
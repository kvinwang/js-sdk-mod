"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MockProvider = void 0;
var _eventemitter = _interopRequireDefault(require("eventemitter3"));
var _testing = require("@polkadot/keyring/testing");
var _types = require("@polkadot/types");
var _jsonrpc = _interopRequireDefault(require("@polkadot/types/interfaces/jsonrpc"));
var _Header = _interopRequireDefault(require("@polkadot/types-support/json/Header.004.json"));
var _SignedBlock004Immortal = _interopRequireDefault(require("@polkadot/types-support/json/SignedBlock.004.immortal.json"));
var _staticSubstrate = _interopRequireDefault(require("@polkadot/types-support/metadata/static-substrate"));
var _util = require("@polkadot/util");
var _utilCrypto = require("@polkadot/util-crypto");
// Copyright 2017-2022 @polkadot/rpc-provider authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable camelcase */

const INTERVAL = 1000;
const SUBSCRIPTIONS = Array.prototype.concat.apply([], Object.values(_jsonrpc.default).map(section => Object.values(section).filter(_ref => {
  let {
    isSubscription
  } = _ref;
  return isSubscription;
}).map(_ref2 => {
  let {
    jsonrpc
  } = _ref2;
  return jsonrpc;
}).concat('chain_subscribeNewHead')));
const keyring = (0, _testing.createTestKeyring)({
  type: 'ed25519'
});
const l = (0, _util.logger)('api-mock');

/**
 * A mock provider mainly used for testing.
 * @return {ProviderInterface} The mock provider
 * @internal
 */
class MockProvider {
  db = {};
  emitter = new _eventemitter.default();
  isUpdating = true;
  prevNumber = new _util.BN(-1);
  requests = {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-unsafe-member-access
    chain_getBlock: () => this.registry.createType('SignedBlock', _SignedBlock004Immortal.default.result).toJSON(),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    chain_getBlockHash: () => '0x1234000000000000000000000000000000000000000000000000000000000000',
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    chain_getFinalizedHead: () => this.registry.createType('Header', _Header.default.result).hash,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    chain_getHeader: () => this.registry.createType('Header', _Header.default.result).toJSON(),
    rpc_methods: () => this.registry.createType('RpcMethods').toJSON(),
    state_getKeys: () => [],
    state_getKeysPaged: () => [],
    state_getMetadata: () => _staticSubstrate.default,
    state_getRuntimeVersion: () => this.registry.createType('RuntimeVersion').toHex(),
    state_getStorage: (storage, _ref3) => {
      let [key] = _ref3;
      return (0, _util.u8aToHex)(storage[key]);
    },
    system_chain: () => 'mockChain',
    system_health: () => ({}),
    system_name: () => 'mockClient',
    system_properties: () => ({
      ss58Format: 42
    }),
    system_upgradedToTripleRefCount: () => this.registry.createType('bool', true),
    system_version: () => '9.8.7',
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, sort-keys
    dev_echo: (_, params) => params
  };
  subscriptions = SUBSCRIPTIONS.reduce((subs, name) => {
    subs[name] = {
      callbacks: {},
      lastValue: null
    };
    return subs;
  }, {});
  subscriptionId = 0;
  subscriptionMap = {};
  constructor(registry) {
    this.registry = registry;
    this.init();
  }
  get hasSubscriptions() {
    return true;
  }
  clone() {
    throw new Error('Unimplemented');
  }
  async connect() {
    // noop
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async disconnect() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
  get isClonable() {
    return false;
  }
  get isConnected() {
    return true;
  }
  on(type, sub) {
    this.emitter.on(type, sub);
    return () => {
      this.emitter.removeListener(type, sub);
    };
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async send(method, params) {
    l.debug(() => ['send', method, params]);
    if (!this.requests[method]) {
      throw new Error(`provider.send: Invalid method '${method}'`);
    }
    return this.requests[method](this.db, params);
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async subscribe(type, method) {
    for (var _len = arguments.length, params = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      params[_key - 2] = arguments[_key];
    }
    l.debug(() => ['subscribe', method, params]);
    if (!this.subscriptions[method]) {
      throw new Error(`provider.subscribe: Invalid method '${method}'`);
    }
    const callback = params.pop();
    const id = ++this.subscriptionId;
    this.subscriptions[method].callbacks[id] = callback;
    this.subscriptionMap[id] = method;
    if (this.subscriptions[method].lastValue !== null) {
      callback(null, this.subscriptions[method].lastValue);
    }
    return id;
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async unsubscribe(type, method, id) {
    const sub = this.subscriptionMap[id];
    l.debug(() => ['unsubscribe', id, sub]);
    if (!sub) {
      throw new Error(`Unable to find subscription for ${id}`);
    }
    delete this.subscriptionMap[id];
    delete this.subscriptions[sub].callbacks[id];
    return true;
  }
  init() {
    const emitEvents = ['connected', 'disconnected'];
    let emitIndex = 0;
    let newHead = this.makeBlockHeader();
    let counter = -1;
    const metadata = new _types.Metadata(this.registry, _staticSubstrate.default);
    this.registry.setMetadata(metadata);
    const query = (0, _types.decorateStorage)(this.registry, metadata.asLatest, metadata.version);

    // Do something every 1 seconds
    this.intervalId = setInterval(() => {
      if (!this.isUpdating) {
        return;
      }

      // create a new header (next block)
      newHead = this.makeBlockHeader();

      // increment the balances and nonce for each account
      keyring.getPairs().forEach((_ref4, index) => {
        let {
          publicKey
        } = _ref4;
        this.setStateBn(query.system.account(publicKey), newHead.number.toBn().addn(index));
      });

      // set the timestamp for the current block
      this.setStateBn(query.timestamp.now(), Math.floor(Date.now() / 1000));
      this.updateSubs('chain_subscribeNewHead', newHead);

      // We emit connected/disconnected at intervals
      if (++counter % 2 === 1) {
        if (++emitIndex === emitEvents.length) {
          emitIndex = 0;
        }
        this.emitter.emit(emitEvents[emitIndex]);
      }
    }, INTERVAL);
  }
  makeBlockHeader() {
    const blockNumber = this.prevNumber.addn(1);
    const header = this.registry.createType('Header', {
      digest: {
        logs: []
      },
      extrinsicsRoot: (0, _utilCrypto.randomAsU8a)(),
      number: blockNumber,
      parentHash: blockNumber.isZero() ? new Uint8Array(32) : (0, _util.bnToU8a)(this.prevNumber, {
        bitLength: 256,
        isLe: false
      }),
      stateRoot: (0, _util.bnToU8a)(blockNumber, {
        bitLength: 256,
        isLe: false
      })
    });
    this.prevNumber = blockNumber;
    return header;
  }
  setStateBn(key, value) {
    this.db[(0, _util.u8aToHex)(key)] = (0, _util.bnToU8a)(value, {
      bitLength: 64,
      isLe: true
    });
  }
  updateSubs(method, value) {
    this.subscriptions[method].lastValue = value;
    Object.values(this.subscriptions[method].callbacks).forEach(cb => {
      try {
        cb(null, value.toJSON());
      } catch (error) {
        l.error(`Error on '${method}' subscription`, error);
      }
    });
  }
}
exports.MockProvider = MockProvider;
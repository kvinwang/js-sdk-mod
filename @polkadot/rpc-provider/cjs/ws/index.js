"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WsProvider = void 0;
var _classPrivateFieldLooseBase2 = _interopRequireDefault(require("@babel/runtime/helpers/classPrivateFieldLooseBase"));
var _classPrivateFieldLooseKey2 = _interopRequireDefault(require("@babel/runtime/helpers/classPrivateFieldLooseKey"));
var _eventemitter2 = _interopRequireDefault(require("eventemitter3"));
var _util = require("@polkadot/util");
var _xGlobal = require("@polkadot/x-global");
var _xWs = require("@polkadot/x-ws");
var _coder2 = require("../coder");
var _defaults = _interopRequireDefault(require("../defaults"));
var _lru = require("../lru");
var _errors = require("./errors");
// Copyright 2017-2022 @polkadot/rpc-provider authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable camelcase */

const ALIASES = {
  chain_finalisedHead: 'chain_finalizedHead',
  chain_subscribeFinalisedHeads: 'chain_subscribeFinalizedHeads',
  chain_unsubscribeFinalisedHeads: 'chain_unsubscribeFinalizedHeads'
};
const RETRY_DELAY = 2500;
const DEFAULT_TIMEOUT_MS = 60 * 1000;
const TIMEOUT_INTERVAL = 5000;
const MEGABYTE = 1024 * 1024;
const l = (0, _util.logger)('api-ws');
function eraseRecord(record, cb) {
  Object.keys(record).forEach(key => {
    if (cb) {
      cb(record[key]);
    }
    delete record[key];
  });
}

/**
 * # @polkadot/rpc-provider/ws
 *
 * @name WsProvider
 *
 * @description The WebSocket Provider allows sending requests using WebSocket to a WebSocket RPC server TCP port. Unlike the [[HttpProvider]], it does support subscriptions and allows listening to events such as new blocks or balance changes.
 *
 * @example
 * <BR>
 *
 * ```javascript
 * import Api from '@polkadot/api/promise';
 * import { WsProvider } from '@polkadot/rpc-provider/ws';
 *
 * const provider = new WsProvider('ws://127.0.0.1:9944');
 * const api = new Api(provider);
 * ```
 *
 * @see [[HttpProvider]]
 */
var _callCache = /*#__PURE__*/(0, _classPrivateFieldLooseKey2.default)("callCache");
var _coder = /*#__PURE__*/(0, _classPrivateFieldLooseKey2.default)("coder");
var _endpoints = /*#__PURE__*/(0, _classPrivateFieldLooseKey2.default)("endpoints");
var _headers = /*#__PURE__*/(0, _classPrivateFieldLooseKey2.default)("headers");
var _eventemitter = /*#__PURE__*/(0, _classPrivateFieldLooseKey2.default)("eventemitter");
var _handlers = /*#__PURE__*/(0, _classPrivateFieldLooseKey2.default)("handlers");
var _isReadyPromise = /*#__PURE__*/(0, _classPrivateFieldLooseKey2.default)("isReadyPromise");
var _stats = /*#__PURE__*/(0, _classPrivateFieldLooseKey2.default)("stats");
var _waitingForId = /*#__PURE__*/(0, _classPrivateFieldLooseKey2.default)("waitingForId");
var _autoConnectMs = /*#__PURE__*/(0, _classPrivateFieldLooseKey2.default)("autoConnectMs");
var _endpointIndex = /*#__PURE__*/(0, _classPrivateFieldLooseKey2.default)("endpointIndex");
var _isConnected = /*#__PURE__*/(0, _classPrivateFieldLooseKey2.default)("isConnected");
var _subscriptions = /*#__PURE__*/(0, _classPrivateFieldLooseKey2.default)("subscriptions");
var _timeoutId = /*#__PURE__*/(0, _classPrivateFieldLooseKey2.default)("timeoutId");
var _websocket = /*#__PURE__*/(0, _classPrivateFieldLooseKey2.default)("websocket");
var _timeout = /*#__PURE__*/(0, _classPrivateFieldLooseKey2.default)("timeout");
var _send = /*#__PURE__*/(0, _classPrivateFieldLooseKey2.default)("send");
var _emit = /*#__PURE__*/(0, _classPrivateFieldLooseKey2.default)("emit");
var _onSocketClose = /*#__PURE__*/(0, _classPrivateFieldLooseKey2.default)("onSocketClose");
var _onSocketError = /*#__PURE__*/(0, _classPrivateFieldLooseKey2.default)("onSocketError");
var _onSocketMessage = /*#__PURE__*/(0, _classPrivateFieldLooseKey2.default)("onSocketMessage");
var _onSocketMessageResult = /*#__PURE__*/(0, _classPrivateFieldLooseKey2.default)("onSocketMessageResult");
var _onSocketMessageSubscribe = /*#__PURE__*/(0, _classPrivateFieldLooseKey2.default)("onSocketMessageSubscribe");
var _onSocketOpen = /*#__PURE__*/(0, _classPrivateFieldLooseKey2.default)("onSocketOpen");
var _resubscribe = /*#__PURE__*/(0, _classPrivateFieldLooseKey2.default)("resubscribe");
var _timeoutHandlers = /*#__PURE__*/(0, _classPrivateFieldLooseKey2.default)("timeoutHandlers");
class WsProvider {
  /**
   * @param {string | string[]}  endpoint    The endpoint url. Usually `ws://ip:9944` or `wss://ip:9944`, may provide an array of endpoint strings.
   * @param {boolean} autoConnect Whether to connect automatically or not.
   * @param {number} [timeout] Custom timeout value
   */
  constructor() {
    var _this = this;
    let endpoint = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _defaults.default.WS_URL;
    let autoConnectMs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : RETRY_DELAY;
    let headers = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    let timeout = arguments.length > 3 ? arguments[3] : undefined;
    Object.defineProperty(this, _send, {
      value: _send2
    });
    Object.defineProperty(this, _callCache, {
      writable: true,
      value: new _lru.LRUCache()
    });
    Object.defineProperty(this, _coder, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _endpoints, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _headers, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _eventemitter, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _handlers, {
      writable: true,
      value: {}
    });
    Object.defineProperty(this, _isReadyPromise, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _stats, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _waitingForId, {
      writable: true,
      value: {}
    });
    Object.defineProperty(this, _autoConnectMs, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _endpointIndex, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _isConnected, {
      writable: true,
      value: false
    });
    Object.defineProperty(this, _subscriptions, {
      writable: true,
      value: {}
    });
    Object.defineProperty(this, _timeoutId, {
      writable: true,
      value: null
    });
    Object.defineProperty(this, _websocket, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _timeout, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _emit, {
      writable: true,
      value: function (type) {
        for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }
        (0, _classPrivateFieldLooseBase2.default)(_this, _eventemitter)[_eventemitter].emit(type, ...args);
      }
    });
    Object.defineProperty(this, _onSocketClose, {
      writable: true,
      value: event => {
        const error = new Error(`disconnected from ${(0, _classPrivateFieldLooseBase2.default)(this, _endpoints)[_endpoints][(0, _classPrivateFieldLooseBase2.default)(this, _endpointIndex)[_endpointIndex]]}: ${event.code}:: ${event.reason || (0, _errors.getWSErrorString)(event.code)}`);
        if ((0, _classPrivateFieldLooseBase2.default)(this, _autoConnectMs)[_autoConnectMs] > 0) {
          l.error(error.message);
        }
        (0, _classPrivateFieldLooseBase2.default)(this, _isConnected)[_isConnected] = false;
        if ((0, _classPrivateFieldLooseBase2.default)(this, _websocket)[_websocket]) {
          (0, _classPrivateFieldLooseBase2.default)(this, _websocket)[_websocket].onclose = null;
          (0, _classPrivateFieldLooseBase2.default)(this, _websocket)[_websocket].onerror = null;
          (0, _classPrivateFieldLooseBase2.default)(this, _websocket)[_websocket].onmessage = null;
          (0, _classPrivateFieldLooseBase2.default)(this, _websocket)[_websocket].onopen = null;
          (0, _classPrivateFieldLooseBase2.default)(this, _websocket)[_websocket] = null;
        }
        if ((0, _classPrivateFieldLooseBase2.default)(this, _timeoutId)[_timeoutId]) {
          clearInterval((0, _classPrivateFieldLooseBase2.default)(this, _timeoutId)[_timeoutId]);
          (0, _classPrivateFieldLooseBase2.default)(this, _timeoutId)[_timeoutId] = null;
        }
        (0, _classPrivateFieldLooseBase2.default)(this, _emit)[_emit]('disconnected');

        // reject all hanging requests
        eraseRecord((0, _classPrivateFieldLooseBase2.default)(this, _handlers)[_handlers], h => {
          try {
            h.callback(error, undefined);
          } catch (err) {
            // does not throw
            l.error(err);
          }
        });
        eraseRecord((0, _classPrivateFieldLooseBase2.default)(this, _waitingForId)[_waitingForId]);
        if ((0, _classPrivateFieldLooseBase2.default)(this, _autoConnectMs)[_autoConnectMs] > 0) {
          setTimeout(() => {
            this.connectWithRetry().catch(() => {
              // does not throw
            });
          }, (0, _classPrivateFieldLooseBase2.default)(this, _autoConnectMs)[_autoConnectMs]);
        }
      }
    });
    Object.defineProperty(this, _onSocketError, {
      writable: true,
      value: error => {
        l.debug(() => ['socket error', error]);
        (0, _classPrivateFieldLooseBase2.default)(this, _emit)[_emit]('error', error);
      }
    });
    Object.defineProperty(this, _onSocketMessage, {
      writable: true,
      value: message => {
        l.debug(() => ['received', message.data]);
        (0, _classPrivateFieldLooseBase2.default)(this, _stats)[_stats].total.bytesRecv += message.data.length;
        const response = JSON.parse(message.data);
        return (0, _util.isUndefined)(response.method) ? (0, _classPrivateFieldLooseBase2.default)(this, _onSocketMessageResult)[_onSocketMessageResult](response) : (0, _classPrivateFieldLooseBase2.default)(this, _onSocketMessageSubscribe)[_onSocketMessageSubscribe](response);
      }
    });
    Object.defineProperty(this, _onSocketMessageResult, {
      writable: true,
      value: response => {
        const handler = (0, _classPrivateFieldLooseBase2.default)(this, _handlers)[_handlers][response.id];
        if (!handler) {
          l.debug(() => `Unable to find handler for id=${response.id}`);
          return;
        }
        try {
          const {
            method,
            params,
            subscription
          } = handler;
          const result = (0, _classPrivateFieldLooseBase2.default)(this, _coder)[_coder].decodeResponse(response);

          // first send the result - in case of subs, we may have an update
          // immediately if we have some queued results already
          handler.callback(null, result);
          if (subscription) {
            const subId = `${subscription.type}::${result}`;
            (0, _classPrivateFieldLooseBase2.default)(this, _subscriptions)[_subscriptions][subId] = (0, _util.objectSpread)({}, subscription, {
              method,
              params
            });

            // if we have a result waiting for this subscription already
            if ((0, _classPrivateFieldLooseBase2.default)(this, _waitingForId)[_waitingForId][subId]) {
              (0, _classPrivateFieldLooseBase2.default)(this, _onSocketMessageSubscribe)[_onSocketMessageSubscribe]((0, _classPrivateFieldLooseBase2.default)(this, _waitingForId)[_waitingForId][subId]);
            }
          }
        } catch (error) {
          (0, _classPrivateFieldLooseBase2.default)(this, _stats)[_stats].total.errors++;
          handler.callback(error, undefined);
        }
        delete (0, _classPrivateFieldLooseBase2.default)(this, _handlers)[_handlers][response.id];
      }
    });
    Object.defineProperty(this, _onSocketMessageSubscribe, {
      writable: true,
      value: response => {
        const method = ALIASES[response.method] || response.method || 'invalid';
        const subId = `${method}::${response.params.subscription}`;
        const handler = (0, _classPrivateFieldLooseBase2.default)(this, _subscriptions)[_subscriptions][subId];
        if (!handler) {
          // store the JSON, we could have out-of-order subid coming in
          (0, _classPrivateFieldLooseBase2.default)(this, _waitingForId)[_waitingForId][subId] = response;
          l.debug(() => `Unable to find handler for subscription=${subId}`);
          return;
        }

        // housekeeping
        delete (0, _classPrivateFieldLooseBase2.default)(this, _waitingForId)[_waitingForId][subId];
        try {
          const result = (0, _classPrivateFieldLooseBase2.default)(this, _coder)[_coder].decodeResponse(response);
          handler.callback(null, result);
        } catch (error) {
          (0, _classPrivateFieldLooseBase2.default)(this, _stats)[_stats].total.errors++;
          handler.callback(error, undefined);
        }
      }
    });
    Object.defineProperty(this, _onSocketOpen, {
      writable: true,
      value: () => {
        if ((0, _classPrivateFieldLooseBase2.default)(this, _websocket)[_websocket] === null) {
          throw new Error('WebSocket cannot be null in onOpen');
        }
        l.debug(() => ['connected to', (0, _classPrivateFieldLooseBase2.default)(this, _endpoints)[_endpoints][(0, _classPrivateFieldLooseBase2.default)(this, _endpointIndex)[_endpointIndex]]]);
        (0, _classPrivateFieldLooseBase2.default)(this, _isConnected)[_isConnected] = true;
        (0, _classPrivateFieldLooseBase2.default)(this, _emit)[_emit]('connected');
        (0, _classPrivateFieldLooseBase2.default)(this, _resubscribe)[_resubscribe]();
        return true;
      }
    });
    Object.defineProperty(this, _resubscribe, {
      writable: true,
      value: () => {
        const subscriptions = (0, _classPrivateFieldLooseBase2.default)(this, _subscriptions)[_subscriptions];
        (0, _classPrivateFieldLooseBase2.default)(this, _subscriptions)[_subscriptions] = {};
        Promise.all(Object.keys(subscriptions).map(async id => {
          const {
            callback,
            method,
            params,
            type
          } = subscriptions[id];

          // only re-create subscriptions which are not in author (only area where
          // transactions are created, i.e. submissions such as 'author_submitAndWatchExtrinsic'
          // are not included (and will not be re-broadcast)
          if (type.startsWith('author_')) {
            return;
          }
          try {
            await this.subscribe(type, method, params, callback);
          } catch (error) {
            l.error(error);
          }
        })).catch(l.error);
      }
    });
    Object.defineProperty(this, _timeoutHandlers, {
      writable: true,
      value: () => {
        const now = Date.now();
        const ids = Object.keys((0, _classPrivateFieldLooseBase2.default)(this, _handlers)[_handlers]);
        for (let i = 0; i < ids.length; i++) {
          const handler = (0, _classPrivateFieldLooseBase2.default)(this, _handlers)[_handlers][ids[i]];
          if (now - handler.start > (0, _classPrivateFieldLooseBase2.default)(this, _timeout)[_timeout]) {
            try {
              handler.callback(new Error(`No response received from RPC endpoint in ${(0, _classPrivateFieldLooseBase2.default)(this, _timeout)[_timeout] / 1000}s`), undefined);
            } catch {
              // ignore
            }
            (0, _classPrivateFieldLooseBase2.default)(this, _stats)[_stats].total.timeout++;
            delete (0, _classPrivateFieldLooseBase2.default)(this, _handlers)[_handlers][ids[i]];
          }
        }
      }
    });
    const endpoints = Array.isArray(endpoint) ? endpoint : [endpoint];
    if (endpoints.length === 0) {
      throw new Error('WsProvider requires at least one Endpoint');
    }
    endpoints.forEach(endpoint => {
      if (!/^(wss|ws):\/\//.test(endpoint)) {
        throw new Error(`Endpoint should start with 'ws://', received '${endpoint}'`);
      }
    });
    (0, _classPrivateFieldLooseBase2.default)(this, _eventemitter)[_eventemitter] = new _eventemitter2.default();
    (0, _classPrivateFieldLooseBase2.default)(this, _autoConnectMs)[_autoConnectMs] = autoConnectMs || 0;
    (0, _classPrivateFieldLooseBase2.default)(this, _coder)[_coder] = new _coder2.RpcCoder();
    (0, _classPrivateFieldLooseBase2.default)(this, _endpointIndex)[_endpointIndex] = -1;
    (0, _classPrivateFieldLooseBase2.default)(this, _endpoints)[_endpoints] = endpoints;
    (0, _classPrivateFieldLooseBase2.default)(this, _headers)[_headers] = headers;
    (0, _classPrivateFieldLooseBase2.default)(this, _websocket)[_websocket] = null;
    (0, _classPrivateFieldLooseBase2.default)(this, _stats)[_stats] = {
      active: {
        requests: 0,
        subscriptions: 0
      },
      total: {
        bytesRecv: 0,
        bytesSent: 0,
        cached: 0,
        errors: 0,
        requests: 0,
        subscriptions: 0,
        timeout: 0
      }
    };
    (0, _classPrivateFieldLooseBase2.default)(this, _timeout)[_timeout] = timeout || DEFAULT_TIMEOUT_MS;
    if (autoConnectMs > 0) {
      this.connectWithRetry().catch(() => {
        // does not throw
      });
    }
    (0, _classPrivateFieldLooseBase2.default)(this, _isReadyPromise)[_isReadyPromise] = new Promise(resolve => {
      (0, _classPrivateFieldLooseBase2.default)(this, _eventemitter)[_eventemitter].once('connected', () => {
        resolve(this);
      });
    });
  }

  /**
   * @summary `true` when this provider supports subscriptions
   */
  get hasSubscriptions() {
    return true;
  }

  /**
   * @summary `true` when this provider supports clone()
   */
  get isClonable() {
    return true;
  }

  /**
   * @summary Whether the node is connected or not.
   * @return {boolean} true if connected
   */
  get isConnected() {
    return (0, _classPrivateFieldLooseBase2.default)(this, _isConnected)[_isConnected];
  }

  /**
   * @description Promise that resolves the first time we are connected and loaded
   */
  get isReady() {
    return (0, _classPrivateFieldLooseBase2.default)(this, _isReadyPromise)[_isReadyPromise];
  }

  /**
   * @description Returns a clone of the object
   */
  clone() {
    return new WsProvider((0, _classPrivateFieldLooseBase2.default)(this, _endpoints)[_endpoints]);
  }

  /**
   * @summary Manually connect
   * @description The [[WsProvider]] connects automatically by default, however if you decided otherwise, you may
   * connect manually using this method.
   */
  // eslint-disable-next-line @typescript-eslint/require-await
  async connect() {
    try {
      (0, _classPrivateFieldLooseBase2.default)(this, _endpointIndex)[_endpointIndex] = ((0, _classPrivateFieldLooseBase2.default)(this, _endpointIndex)[_endpointIndex] + 1) % (0, _classPrivateFieldLooseBase2.default)(this, _endpoints)[_endpoints].length;

      // the as typeof WebSocket here is Deno-specific - not available on the globalThis
      (0, _classPrivateFieldLooseBase2.default)(this, _websocket)[_websocket] = typeof _xGlobal.xglobal.WebSocket !== 'undefined' && (0, _util.isChildClass)(_xGlobal.xglobal.WebSocket, _xWs.WebSocket) ? new _xWs.WebSocket((0, _classPrivateFieldLooseBase2.default)(this, _endpoints)[_endpoints][(0, _classPrivateFieldLooseBase2.default)(this, _endpointIndex)[_endpointIndex]])
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore - WS may be an instance of w3cwebsocket, which supports headers
      : new _xWs.WebSocket((0, _classPrivateFieldLooseBase2.default)(this, _endpoints)[_endpoints][(0, _classPrivateFieldLooseBase2.default)(this, _endpointIndex)[_endpointIndex]], undefined, undefined, (0, _classPrivateFieldLooseBase2.default)(this, _headers)[_headers], undefined, {
        // default: true
        fragmentOutgoingMessages: true,
        // default: 16K (bump, the Node has issues with too many fragments, e.g. on setCode)
        fragmentationThreshold: 1 * MEGABYTE,
        // default: 1MiB (also align with maxReceivedMessageSize)
        maxReceivedFrameSize: 24 * MEGABYTE,
        // default: 8MB (however Polkadot api.query.staking.erasStakers.entries(356) is over that, 16M is ok there)
        maxReceivedMessageSize: 24 * MEGABYTE
      });
      if ((0, _classPrivateFieldLooseBase2.default)(this, _websocket)[_websocket]) {
        (0, _classPrivateFieldLooseBase2.default)(this, _websocket)[_websocket].onclose = (0, _classPrivateFieldLooseBase2.default)(this, _onSocketClose)[_onSocketClose];
        (0, _classPrivateFieldLooseBase2.default)(this, _websocket)[_websocket].onerror = (0, _classPrivateFieldLooseBase2.default)(this, _onSocketError)[_onSocketError];
        (0, _classPrivateFieldLooseBase2.default)(this, _websocket)[_websocket].onmessage = (0, _classPrivateFieldLooseBase2.default)(this, _onSocketMessage)[_onSocketMessage];
        (0, _classPrivateFieldLooseBase2.default)(this, _websocket)[_websocket].onopen = (0, _classPrivateFieldLooseBase2.default)(this, _onSocketOpen)[_onSocketOpen];
      }

      // timeout any handlers that have not had a response
      (0, _classPrivateFieldLooseBase2.default)(this, _timeoutId)[_timeoutId] = setInterval(() => (0, _classPrivateFieldLooseBase2.default)(this, _timeoutHandlers)[_timeoutHandlers](), TIMEOUT_INTERVAL);
    } catch (error) {
      l.error(error);
      (0, _classPrivateFieldLooseBase2.default)(this, _emit)[_emit]('error', error);
      throw error;
    }
  }

  /**
   * @description Connect, never throwing an error, but rather forcing a retry
   */
  async connectWithRetry() {
    if ((0, _classPrivateFieldLooseBase2.default)(this, _autoConnectMs)[_autoConnectMs] > 0) {
      try {
        await this.connect();
      } catch (error) {
        setTimeout(() => {
          this.connectWithRetry().catch(() => {
            // does not throw
          });
        }, (0, _classPrivateFieldLooseBase2.default)(this, _autoConnectMs)[_autoConnectMs]);
      }
    }
  }

  /**
   * @description Manually disconnect from the connection, clearing auto-connect logic
   */
  // eslint-disable-next-line @typescript-eslint/require-await
  async disconnect() {
    // switch off autoConnect, we are in manual mode now
    (0, _classPrivateFieldLooseBase2.default)(this, _autoConnectMs)[_autoConnectMs] = 0;
    try {
      if ((0, _classPrivateFieldLooseBase2.default)(this, _websocket)[_websocket]) {
        // 1000 - Normal closure; the connection successfully completed
        (0, _classPrivateFieldLooseBase2.default)(this, _websocket)[_websocket].close(1000);
      }
    } catch (error) {
      l.error(error);
      (0, _classPrivateFieldLooseBase2.default)(this, _emit)[_emit]('error', error);
      throw error;
    }
  }

  /**
   * @description Returns the connection stats
   */
  get stats() {
    return {
      active: {
        requests: Object.keys((0, _classPrivateFieldLooseBase2.default)(this, _handlers)[_handlers]).length,
        subscriptions: Object.keys((0, _classPrivateFieldLooseBase2.default)(this, _subscriptions)[_subscriptions]).length
      },
      total: (0, _classPrivateFieldLooseBase2.default)(this, _stats)[_stats].total
    };
  }

  /**
   * @summary Listens on events after having subscribed using the [[subscribe]] function.
   * @param  {ProviderInterfaceEmitted} type Event
   * @param  {ProviderInterfaceEmitCb}  sub  Callback
   * @return unsubscribe function
   */
  on(type, sub) {
    (0, _classPrivateFieldLooseBase2.default)(this, _eventemitter)[_eventemitter].on(type, sub);
    return () => {
      (0, _classPrivateFieldLooseBase2.default)(this, _eventemitter)[_eventemitter].removeListener(type, sub);
    };
  }

  /**
   * @summary Send JSON data using WebSockets to configured HTTP Endpoint or queue.
   * @param method The RPC methods to execute
   * @param params Encoded parameters as applicable for the method
   * @param subscription Subscription details (internally used)
   */
  send(method, params, isCacheable, subscription) {
    (0, _classPrivateFieldLooseBase2.default)(this, _stats)[_stats].total.requests++;
    const [id, body] = (0, _classPrivateFieldLooseBase2.default)(this, _coder)[_coder].encodeJson(method, params);
    let resultPromise = isCacheable ? (0, _classPrivateFieldLooseBase2.default)(this, _callCache)[_callCache].get(body) : null;
    if (!resultPromise) {
      resultPromise = (0, _classPrivateFieldLooseBase2.default)(this, _send)[_send](id, body, method, params, subscription);
      if (isCacheable) {
        (0, _classPrivateFieldLooseBase2.default)(this, _callCache)[_callCache].set(body, resultPromise);
      }
    } else {
      (0, _classPrivateFieldLooseBase2.default)(this, _stats)[_stats].total.cached++;
    }
    return resultPromise;
  }
  /**
   * @name subscribe
   * @summary Allows subscribing to a specific event.
   *
   * @example
   * <BR>
   *
   * ```javascript
   * const provider = new WsProvider('ws://127.0.0.1:9944');
   * const rpc = new Rpc(provider);
   *
   * rpc.state.subscribeStorage([[storage.system.account, <Address>]], (_, values) => {
   *   console.log(values)
   * }).then((subscriptionId) => {
   *   console.log('balance changes subscription id: ', subscriptionId)
   * })
   * ```
   */
  subscribe(type, method, params, callback) {
    (0, _classPrivateFieldLooseBase2.default)(this, _stats)[_stats].total.subscriptions++;

    // subscriptions are not cached, LRU applies to .at(<blockHash>) only
    return this.send(method, params, false, {
      callback,
      type
    });
  }

  /**
   * @summary Allows unsubscribing to subscriptions made with [[subscribe]].
   */
  async unsubscribe(type, method, id) {
    const subscription = `${type}::${id}`;

    // FIXME This now could happen with re-subscriptions. The issue is that with a re-sub
    // the assigned id now does not match what the API user originally received. It has
    // a slight complication in solving - since we cannot rely on the send id, but rather
    // need to find the actual subscription id to map it
    if ((0, _util.isUndefined)((0, _classPrivateFieldLooseBase2.default)(this, _subscriptions)[_subscriptions][subscription])) {
      l.debug(() => `Unable to find active subscription=${subscription}`);
      return false;
    }
    delete (0, _classPrivateFieldLooseBase2.default)(this, _subscriptions)[_subscriptions][subscription];
    try {
      return this.isConnected && !(0, _util.isNull)((0, _classPrivateFieldLooseBase2.default)(this, _websocket)[_websocket]) ? this.send(method, [id]) : true;
    } catch (error) {
      return false;
    }
  }
}
exports.WsProvider = WsProvider;
async function _send2(id, body, method, params, subscription) {
  return new Promise((resolve, reject) => {
    try {
      if (!this.isConnected || (0, _classPrivateFieldLooseBase2.default)(this, _websocket)[_websocket] === null) {
        throw new Error('WebSocket is not connected');
      }
      const callback = (error, result) => {
        error ? reject(error) : resolve(result);
      };
      l.debug(() => ['calling', method, body]);
      (0, _classPrivateFieldLooseBase2.default)(this, _handlers)[_handlers][id] = {
        callback,
        method,
        params,
        start: Date.now(),
        subscription
      };
      (0, _classPrivateFieldLooseBase2.default)(this, _stats)[_stats].total.bytesSent += body.length;
      (0, _classPrivateFieldLooseBase2.default)(this, _websocket)[_websocket].send(body);
    } catch (error) {
      (0, _classPrivateFieldLooseBase2.default)(this, _stats)[_stats].total.errors++;
      reject(error);
    }
  });
}
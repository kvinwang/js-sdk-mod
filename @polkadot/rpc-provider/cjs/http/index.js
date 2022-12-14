"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HttpProvider = void 0;
var _classPrivateFieldLooseBase2 = _interopRequireDefault(require("@babel/runtime/helpers/classPrivateFieldLooseBase"));
var _classPrivateFieldLooseKey2 = _interopRequireDefault(require("@babel/runtime/helpers/classPrivateFieldLooseKey"));
var _util = require("@polkadot/util");
var _xFetch = require("@polkadot/x-fetch");
var _coder2 = require("../coder");
var _defaults = _interopRequireDefault(require("../defaults"));
var _lru = require("../lru");
// Copyright 2017-2022 @polkadot/rpc-provider authors & contributors
// SPDX-License-Identifier: Apache-2.0

const ERROR_SUBSCRIBE = 'HTTP Provider does not have subscriptions, use WebSockets instead';
const l = (0, _util.logger)('api-http');

/**
 * # @polkadot/rpc-provider
 *
 * @name HttpProvider
 *
 * @description The HTTP Provider allows sending requests using HTTP to a HTTP RPC server TCP port. It does not support subscriptions so you won't be able to listen to events such as new blocks or balance changes. It is usually preferable using the [[WsProvider]].
 *
 * @example
 * <BR>
 *
 * ```javascript
 * import Api from '@polkadot/api/promise';
 * import { HttpProvider } from '@polkadot/rpc-provider';
 *
 * const provider = new HttpProvider('http://127.0.0.1:9933');
 * const api = new Api(provider);
 * ```
 *
 * @see [[WsProvider]]
 */
var _callCache = /*#__PURE__*/(0, _classPrivateFieldLooseKey2.default)("callCache");
var _coder = /*#__PURE__*/(0, _classPrivateFieldLooseKey2.default)("coder");
var _endpoint = /*#__PURE__*/(0, _classPrivateFieldLooseKey2.default)("endpoint");
var _headers = /*#__PURE__*/(0, _classPrivateFieldLooseKey2.default)("headers");
var _stats = /*#__PURE__*/(0, _classPrivateFieldLooseKey2.default)("stats");
var _send = /*#__PURE__*/(0, _classPrivateFieldLooseKey2.default)("send");
class HttpProvider {
  /**
   * @param {string} endpoint The endpoint url starting with http://
   */
  constructor() {
    let endpoint = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _defaults.default.HTTP_URL;
    let headers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
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
    Object.defineProperty(this, _endpoint, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _headers, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _stats, {
      writable: true,
      value: void 0
    });
    if (!/^(https|http):\/\//.test(endpoint)) {
      throw new Error(`Endpoint should start with 'http://' or 'https://', received '${endpoint}'`);
    }
    (0, _classPrivateFieldLooseBase2.default)(this, _coder)[_coder] = new _coder2.RpcCoder();
    (0, _classPrivateFieldLooseBase2.default)(this, _endpoint)[_endpoint] = endpoint;
    (0, _classPrivateFieldLooseBase2.default)(this, _headers)[_headers] = headers;
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
  }

  /**
   * @summary `true` when this provider supports subscriptions
   */
  get hasSubscriptions() {
    return false;
  }

  /**
   * @description Returns a clone of the object
   */
  clone() {
    return new HttpProvider((0, _classPrivateFieldLooseBase2.default)(this, _endpoint)[_endpoint], (0, _classPrivateFieldLooseBase2.default)(this, _headers)[_headers]);
  }

  /**
   * @description Manually connect from the connection
   */
  async connect() {
    // noop
  }

  /**
   * @description Manually disconnect from the connection
   */
  async disconnect() {
    // noop
  }

  /**
   * @description Returns the connection stats
   */
  get stats() {
    return (0, _classPrivateFieldLooseBase2.default)(this, _stats)[_stats];
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
    return true;
  }

  /**
   * @summary Events are not supported with the HttpProvider, see [[WsProvider]].
   * @description HTTP Provider does not have 'on' emitters. WebSockets should be used instead.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  on(type, sub) {
    l.error('HTTP Provider does not have \'on\' emitters, use WebSockets instead');
    return () => {
      // noop
    };
  }

  /**
   * @summary Send HTTP POST Request with Body to configured HTTP Endpoint.
   */
  async send(method, params, isCacheable) {
    (0, _classPrivateFieldLooseBase2.default)(this, _stats)[_stats].total.requests++;
    const [, body] = (0, _classPrivateFieldLooseBase2.default)(this, _coder)[_coder].encodeJson(method, params);
    let resultPromise = isCacheable ? (0, _classPrivateFieldLooseBase2.default)(this, _callCache)[_callCache].get(body) : null;
    if (!resultPromise) {
      resultPromise = (0, _classPrivateFieldLooseBase2.default)(this, _send)[_send](body);
      if (isCacheable) {
        (0, _classPrivateFieldLooseBase2.default)(this, _callCache)[_callCache].set(body, resultPromise);
      }
    } else {
      (0, _classPrivateFieldLooseBase2.default)(this, _stats)[_stats].total.cached++;
    }
    return resultPromise;
  }
  /**
   * @summary Subscriptions are not supported with the HttpProvider, see [[WsProvider]].
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/require-await
  async subscribe(types, method, params, cb) {
    l.error(ERROR_SUBSCRIBE);
    throw new Error(ERROR_SUBSCRIBE);
  }

  /**
   * @summary Subscriptions are not supported with the HttpProvider, see [[WsProvider]].
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/require-await
  async unsubscribe(type, method, id) {
    l.error(ERROR_SUBSCRIBE);
    throw new Error(ERROR_SUBSCRIBE);
  }
}
exports.HttpProvider = HttpProvider;
async function _send2(body) {
  (0, _classPrivateFieldLooseBase2.default)(this, _stats)[_stats].active.requests++;
  (0, _classPrivateFieldLooseBase2.default)(this, _stats)[_stats].total.bytesSent += body.length;
  try {
    const response = await (0, _xFetch.fetch)((0, _classPrivateFieldLooseBase2.default)(this, _endpoint)[_endpoint], {
      body,
      headers: {
        Accept: 'application/json',
        'Content-Length': `${body.length}`,
        'Content-Type': 'application/json',
        ...(0, _classPrivateFieldLooseBase2.default)(this, _headers)[_headers]
      },
      method: 'POST'
    });
    if (!response.ok) {
      throw new Error(`[${response.status}]: ${response.statusText}`);
    }
    const result = await response.text();
    (0, _classPrivateFieldLooseBase2.default)(this, _stats)[_stats].total.bytesRecv += result.length;
    const decoded = (0, _classPrivateFieldLooseBase2.default)(this, _coder)[_coder].decodeResponse(JSON.parse(result));
    (0, _classPrivateFieldLooseBase2.default)(this, _stats)[_stats].active.requests--;
    return decoded;
  } catch (e) {
    (0, _classPrivateFieldLooseBase2.default)(this, _stats)[_stats].active.requests--;
    (0, _classPrivateFieldLooseBase2.default)(this, _stats)[_stats].total.errors++;
    throw e;
  }
}
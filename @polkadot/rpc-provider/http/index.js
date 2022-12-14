import _classPrivateFieldLooseBase from "@babel/runtime/helpers/esm/classPrivateFieldLooseBase";
import _classPrivateFieldLooseKey from "@babel/runtime/helpers/esm/classPrivateFieldLooseKey";
// Copyright 2017-2022 @polkadot/rpc-provider authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { logger } from '@polkadot/util';
import { fetch } from '@polkadot/x-fetch';
import { RpcCoder } from "../coder/index.js";
import defaults from "../defaults.js";
import { LRUCache } from "../lru.js";
const ERROR_SUBSCRIBE = 'HTTP Provider does not have subscriptions, use WebSockets instead';
const l = logger('api-http');

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
var _callCache = /*#__PURE__*/_classPrivateFieldLooseKey("callCache");
var _coder = /*#__PURE__*/_classPrivateFieldLooseKey("coder");
var _endpoint = /*#__PURE__*/_classPrivateFieldLooseKey("endpoint");
var _headers = /*#__PURE__*/_classPrivateFieldLooseKey("headers");
var _stats = /*#__PURE__*/_classPrivateFieldLooseKey("stats");
var _send = /*#__PURE__*/_classPrivateFieldLooseKey("send");
export class HttpProvider {
  /**
   * @param {string} endpoint The endpoint url starting with http://
   */
  constructor(endpoint = defaults.HTTP_URL, headers = {}) {
    Object.defineProperty(this, _send, {
      value: _send2
    });
    Object.defineProperty(this, _callCache, {
      writable: true,
      value: new LRUCache()
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
    _classPrivateFieldLooseBase(this, _coder)[_coder] = new RpcCoder();
    _classPrivateFieldLooseBase(this, _endpoint)[_endpoint] = endpoint;
    _classPrivateFieldLooseBase(this, _headers)[_headers] = headers;
    _classPrivateFieldLooseBase(this, _stats)[_stats] = {
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
    return new HttpProvider(_classPrivateFieldLooseBase(this, _endpoint)[_endpoint], _classPrivateFieldLooseBase(this, _headers)[_headers]);
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
    return _classPrivateFieldLooseBase(this, _stats)[_stats];
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
    _classPrivateFieldLooseBase(this, _stats)[_stats].total.requests++;
    const [, body] = _classPrivateFieldLooseBase(this, _coder)[_coder].encodeJson(method, params);
    let resultPromise = isCacheable ? _classPrivateFieldLooseBase(this, _callCache)[_callCache].get(body) : null;
    if (!resultPromise) {
      resultPromise = _classPrivateFieldLooseBase(this, _send)[_send](body);
      if (isCacheable) {
        _classPrivateFieldLooseBase(this, _callCache)[_callCache].set(body, resultPromise);
      }
    } else {
      _classPrivateFieldLooseBase(this, _stats)[_stats].total.cached++;
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
async function _send2(body) {
  _classPrivateFieldLooseBase(this, _stats)[_stats].active.requests++;
  _classPrivateFieldLooseBase(this, _stats)[_stats].total.bytesSent += body.length;
  try {
    const response = await fetch(_classPrivateFieldLooseBase(this, _endpoint)[_endpoint], {
      body,
      headers: {
        Accept: 'application/json',
        'Content-Length': `${body.length}`,
        'Content-Type': 'application/json',
        ..._classPrivateFieldLooseBase(this, _headers)[_headers]
      },
      method: 'POST'
    });
    if (!response.ok) {
      throw new Error(`[${response.status}]: ${response.statusText}`);
    }
    const result = await response.text();
    _classPrivateFieldLooseBase(this, _stats)[_stats].total.bytesRecv += result.length;
    const decoded = _classPrivateFieldLooseBase(this, _coder)[_coder].decodeResponse(JSON.parse(result));
    _classPrivateFieldLooseBase(this, _stats)[_stats].active.requests--;
    return decoded;
  } catch (e) {
    _classPrivateFieldLooseBase(this, _stats)[_stats].active.requests--;
    _classPrivateFieldLooseBase(this, _stats)[_stats].total.errors++;
    throw e;
  }
}
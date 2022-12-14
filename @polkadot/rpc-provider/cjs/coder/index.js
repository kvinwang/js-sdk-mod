"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RpcCoder = void 0;
var _util = require("@polkadot/util");
var _error = _interopRequireDefault(require("./error"));
// Copyright 2017-2022 @polkadot/rpc-provider authors & contributors
// SPDX-License-Identifier: Apache-2.0

function formatErrorData(data) {
  if ((0, _util.isUndefined)(data)) {
    return '';
  }
  const formatted = `: ${(0, _util.isString)(data) ? data.replace(/Error\("/g, '').replace(/\("/g, '(').replace(/"\)/g, ')').replace(/\(/g, ', ').replace(/\)/g, '') : (0, _util.stringify)(data)}`;

  // We need some sort of cut-off here since these can be very large and
  // very nested, pick a number and trim the result display to it
  return formatted.length <= 256 ? formatted : `${formatted.substring(0, 255)}…`;
}
function checkError(error) {
  if (error) {
    const {
      code,
      data,
      message
    } = error;
    throw new _error.default(`${code}: ${message}${formatErrorData(data)}`, code, data);
  }
}

/** @internal */
class RpcCoder {
  #id = 0;
  decodeResponse(response) {
    if (!response || response.jsonrpc !== '2.0') {
      throw new Error('Invalid jsonrpc field in decoded object');
    }
    const isSubscription = !(0, _util.isUndefined)(response.params) && !(0, _util.isUndefined)(response.method);
    if (!(0, _util.isNumber)(response.id) && (!isSubscription || !(0, _util.isNumber)(response.params.subscription) && !(0, _util.isString)(response.params.subscription))) {
      throw new Error('Invalid id field in decoded object');
    }
    checkError(response.error);
    if (response.result === undefined && !isSubscription) {
      throw new Error('No result found in jsonrpc response');
    }
    if (isSubscription) {
      checkError(response.params.error);
      return response.params.result;
    }
    return response.result;
  }
  encodeJson(method, params) {
    const [id, data] = this.encodeObject(method, params);
    return [id, (0, _util.stringify)(data)];
  }
  encodeObject(method, params) {
    const id = ++this.#id;
    return [id, {
      id,
      jsonrpc: '2.0',
      method,
      params
    }];
  }
}
exports.RpcCoder = RpcCoder;
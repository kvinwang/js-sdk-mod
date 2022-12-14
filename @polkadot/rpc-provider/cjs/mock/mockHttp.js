"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TEST_HTTP_URL = void 0;
exports.mockHttp = mockHttp;
var _nock = _interopRequireDefault(require("nock"));
// Copyright 2017-2022 @polkadot/rpc-provider authors & contributors
// SPDX-License-Identifier: Apache-2.0

const TEST_HTTP_URL = 'http://localhost:9944';
exports.TEST_HTTP_URL = TEST_HTTP_URL;
function mockHttp(requests) {
  _nock.default.cleanAll();
  return requests.reduce((scope, request) => scope.post('/').reply(request.code || 200, (uri, body) => {
    scope.body = scope.body || {};
    scope.body[request.method] = body;
    return Object.assign({
      id: body.id,
      jsonrpc: '2.0'
    }, request.reply || {});
  }), (0, _nock.default)(TEST_HTTP_URL));
}
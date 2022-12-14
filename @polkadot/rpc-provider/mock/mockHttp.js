// Copyright 2017-2022 @polkadot/rpc-provider authors & contributors
// SPDX-License-Identifier: Apache-2.0

import nock from 'nock';
export const TEST_HTTP_URL = 'http://localhost:9944';
export function mockHttp(requests) {
  nock.cleanAll();
  return requests.reduce((scope, request) => scope.post('/').reply(request.code || 200, (uri, body) => {
    scope.body = scope.body || {};
    scope.body[request.method] = body;
    return Object.assign({
      id: body.id,
      jsonrpc: '2.0'
    }, request.reply || {});
  }), nock(TEST_HTTP_URL));
}
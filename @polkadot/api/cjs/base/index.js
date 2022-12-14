"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ApiBase = void 0;
var _util = require("@polkadot/util");
var _Getters = require("./Getters");
// Copyright 2017-2022 @polkadot/api authors & contributors
// SPDX-License-Identifier: Apache-2.0

class ApiBase extends _Getters.Getters {
  /**
   * @description Create an instance of the class
   *
   * @param options Options object to create API instance or a Provider instance
   *
   * @example
   * <BR>
   *
   * ```javascript
   * import Api from '@polkadot/api/promise';
   *
   * const api = new Api().isReady();
   *
   * api.rpc.subscribeNewHeads((header) => {
   *   console.log(`new block #${header.number.toNumber()}`);
   * });
   * ```
   */
  constructor() {
    let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    let type = arguments.length > 1 ? arguments[1] : undefined;
    let decorateMethod = arguments.length > 2 ? arguments[2] : undefined;
    super(options, type, decorateMethod);
  }

  /**
   * @description Connect from the underlying provider, halting all network traffic
   */
  connect() {
    return this._rpcCore.connect();
  }

  /**
   * @description Disconnect from the underlying provider, halting all network traffic
   */
  disconnect() {
    this._unsubscribe();
    return this._rpcCore.disconnect();
  }

  /**
   * @description Set an external signer which will be used to sign extrinsic when account passed in is not KeyringPair
   */
  setSigner(signer) {
    this._rx.signer = signer;
  }

  /**
   * @description Signs a raw signer payload, string or Uint8Array
   */
  async sign(address, data) {
    let {
      signer
    } = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    if ((0, _util.isString)(address)) {
      const _signer = signer || this._rx.signer;
      if (!_signer || !_signer.signRaw) {
        throw new Error('No signer exists with a signRaw interface. You possibly need to pass through an explicit keypair for the origin so it can be used for signing.');
      }
      return (await _signer.signRaw((0, _util.objectSpread)({
        type: 'bytes'
      }, data, {
        address
      }))).signature;
    }
    return (0, _util.u8aToHex)(address.sign((0, _util.u8aToU8a)(data.data)));
  }
}
exports.ApiBase = ApiBase;
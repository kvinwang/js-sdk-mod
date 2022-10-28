"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ApiRx = void 0;

var _rxjs = require("rxjs");

var _util = require("@polkadot/util");

var _base = require("../base");

var _decorateMethod = require("./decorateMethod");

// Copyright 2017-2022 @polkadot/api authors & contributors
// SPDX-License-Identifier: Apache-2.0

/**
 * # @polkadot/api/rx
 *
 *  ## Overview
 *
 * @name ApiRx
 *
 * @description
 * ApiRx is a powerful RxJS Observable wrapper around the RPC and interfaces on the Polkadot network. As a full Observable API, all interface calls return RxJS Observables, including the static `.create(...)`. In the same fashion and subscription-based methods return long-running Observables that update with the latest values.
 *
 * The API is well suited to real-time applications where the latest state is needed, unlocking the subscription-based features of Polkadot (and Substrate) clients. Some familiarity with RxJS is a requirement to use the API, however just understanding `.subscribe` and `.pipe` on Observables will unlock full-scale use thereof.
 *
 * @see [[ApiPromise]]
 *
 * ## Usage
 *
 * Making rpc calls -
 * <BR>
 *
 * ```javascript
 * import ApiRx from '@polkadot/api/rx';
 *
 * // initialize via Promise & static create
 * const api = await ApiRx.create().toPromise();
 *
 * // make a call to retrieve the current network head
 * api.rpc.chain.subscribeNewHeads().subscribe((header) => {
 *   console.log(`Chain is at #${header.number}`);
 * });
 * ```
 * <BR>
 *
 * Subscribing to chain state -
 * <BR>
 *
 * ```javascript
 * import { combineLatest, pairwise, switchMap } from 'rxjs';
 * import { ApiRx, WsProvider } from '@polkadot/api';
 *
 *
 * // initialize a provider with a specific endpoint
 * const provider = new WsProvider('wss://example.com:9944')
 *
 * // initialize via isReady & new with specific provider
 * new ApiRx({ provider })
 *   .isReady
 *   .pipe(
 *     switchMap((api) =>
 *       combineLatest([
 *         api.query.timestamp.blockPeriod(),
 *         api.query.timestamp.now().pipe(pairwise())
 *       ])
 *     )
 *   )
 *   .subscribe(([blockPeriod, timestamp]) => {
 *      const elapsed = timestamp[1].toNumber() - timestamp[0].toNumber();
 *      console.log(`timestamp ${timestamp[1]} \nelapsed ${elapsed} \n(${blockPeriod}s target)`);
 *   });
 * ```
 * <BR>
 *
 * Submitting a transaction -
 * <BR>
 *
 * ```javascript
 * import { first, switchMap } from 'rxjs';
 * import ApiRx from '@polkadot/api/rx';
 *
 * // import the test keyring (already has dev keys for Alice, Bob, Charlie, Eve & Ferdie)
 * import testingPairs from '@polkadot/keyring/testingPairs';
 * const keyring = testingPairs();
 *
 * // get api via Promise
 * const api = await ApiRx.create().toPromise();
 *
 * // retrieve nonce for the account
 * api.query.system
 *   .account(keyring.alice.address)
 *   .pipe(
 *      first(),
 *      // pipe nonce into transfer
 *      switchMap(([nonce]) =>
 *        api.tx.balances
 *          // create transfer
 *          .transfer(keyring.bob.address, 12345)
 *          // sign the transaction
 *          .sign(keyring.alice, { nonce })
 *          // send the transaction
 *          .send()
 *      )
 *   )
 *   // subscribe to overall result
 *   .subscribe(({ status }) => {
 *     if (status.isInBlock) {
 *       console.log('Completed at block hash', status.asFinalized.toHex());
 *     }
 *   });
 * ```
 */
class ApiRx extends _base.ApiBase {
  #isReadyRx;
  /**
   * @description Create an instance of the ApiRx class
   * @param options Options to create an instance. Can be either [[ApiOptions]] or [[WsProvider]]
   * @example
   * <BR>
   *
   * ```javascript
   * import { switchMap } from 'rxjs';
   * import Api from '@polkadot/api/rx';
   *
   * new Api().isReady
   *   .pipe(
   *     switchMap((api) =>
   *       api.rpc.chain.subscribeNewHeads()
   *   ))
   *   .subscribe((header) => {
   *     console.log(`new block #${header.number.toNumber()}`);
   *   });
   * ```
   */

  constructor(options) {
    super(options, 'rxjs', _decorateMethod.toRxMethod);
    this.#isReadyRx = (0, _rxjs.from)( // You can create an observable from an event, however my mind groks this form better
    new Promise(resolve => {
      super.on('ready', () => resolve(this));
    }));
  }
  /**
   * @description Creates an ApiRx instance using the supplied provider. Returns an Observable containing the actual Api instance.
   * @param options options that is passed to the class constructor. Can be either [[ApiOptions]] or [[WsProvider]]
   * @example
   * <BR>
   *
   * ```javascript
   * import { switchMap } from 'rxjs';
   * import Api from '@polkadot/api/rx';
   *
   * Api.create()
   *   .pipe(
   *     switchMap((api) =>
   *       api.rpc.chain.subscribeNewHeads()
   *   ))
   *   .subscribe((header) => {
   *     console.log(`new block #${header.number.toNumber()}`);
   *   });
   * ```
   */


  static create(options) {
    return new ApiRx(options).isReady;
  }
  /**
   * @description Observable that returns the first time we are connected and loaded
   */


  get isReady() {
    return this.#isReadyRx;
  }
  /**
   * @description Returns a clone of this ApiRx instance (new underlying provider connection)
   */


  clone() {
    return new ApiRx((0, _util.objectSpread)({}, this._options, {
      source: this
    }));
  }

}

exports.ApiRx = ApiRx;
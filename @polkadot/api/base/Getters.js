// Copyright 2017-2022 @polkadot/api authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { packageInfo } from "../packageInfo.js";
import { findCall, findError } from "./find.js";
import { Init } from "./Init.js";
function assertResult(value) {
  if (value === undefined) {
    throw new Error("Api interfaces needs to be initialized before using, wait for 'isReady'");
  }
  return value;
}
export class Getters extends Init {
  /**
   * @description Runtime call interfaces (currently untyped, only decorated via API options)
   */
  get call() {
    return assertResult(this._call);
  }

  /**
   * @description Contains the parameter types (constants) of all modules.
   *
   * The values are instances of the appropriate type and are accessible using `section`.`constantName`,
   *
   * @example
   * <BR>
   *
   * ```javascript
   * console.log(api.consts.democracy.enactmentPeriod.toString())
   * ```
   */
  get consts() {
    return assertResult(this._consts);
  }

  /**
   * @description Derived results that are injected into the API, allowing for combinations of various query results.
   *
   * @example
   * <BR>
   *
   * ```javascript
   * api.derive.chain.bestNumber((number) => {
   *   console.log('best number', number);
   * });
   * ```
   */
  get derive() {
    return assertResult(this._derive);
  }

  /**
   * @description Errors from metadata
   */
  get errors() {
    return assertResult(this._errors);
  }

  /**
   * @description Events from metadata
   */
  get events() {
    return assertResult(this._events);
  }

  /**
   * @description  Returns the version of extrinsics in-use on this chain
   */
  get extrinsicVersion() {
    return this._extrinsicType;
  }

  /**
   * @description Contains the genesis Hash of the attached chain. Apart from being useful to determine the actual chain, it can also be used to sign immortal transactions.
   */
  get genesisHash() {
    return assertResult(this._genesisHash);
  }

  /**
   * @description true is the underlying provider is connected
   */
  get isConnected() {
    return this._isConnected.getValue();
  }

  /**
   * @description The library information name & version (from package.json)
   */
  get libraryInfo() {
    return `${packageInfo.name} v${packageInfo.version}`;
  }

  /**
   * @description Contains all the chain state modules and their subsequent methods in the API. These are attached dynamically from the runtime metadata.
   *
   * All calls inside the namespace, is denoted by `section`.`method` and may take an optional query parameter. As an example, `api.query.timestamp.now()` (current block timestamp) does not take parameters, while `api.query.system.account(<accountId>)` (retrieving the associated nonce & balances for an account), takes the `AccountId` as a parameter.
   *
   * @example
   * <BR>
   *
   * ```javascript
   * api.query.system.account(<accountId>, ([nonce, balance]) => {
   *   console.log('new free balance', balance.free, 'new nonce', nonce);
   * });
   * ```
   */
  get query() {
    return assertResult(this._query);
  }

  /**
   * @description Allows for the querying of multiple storage entries and the combination thereof into a single result. This is a very optimal way to make multiple queries since it only makes a single connection to the node and retrieves the data over one subscription.
   *
   * @example
   * <BR>
   *
   * ```javascript
   * const unsub = await api.queryMulti(
   *   [
   *     // you can include the storage without any parameters
   *     api.query.balances.totalIssuance,
   *     // or you can pass parameters to the storage query
   *     [api.query.system.account, '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY']
   *   ],
   *   ([existential, [, { free }]]) => {
   *     console.log(`You have ${free.sub(existential)} more than the existential deposit`);
   *
   *     unsub();
   *   }
   * );
   * ```
   */
  get queryMulti() {
    return assertResult(this._queryMulti);
  }

  /**
   * @description Contains all the raw rpc sections and their subsequent methods in the API as defined by the jsonrpc interface definitions. Unlike the dynamic `api.query` and `api.tx` sections, these methods are fixed (although extensible with node upgrades) and not determined by the runtime.
   *
   * RPC endpoints available here allow for the query of chain, node and system information, in addition to providing interfaces for the raw queries of state (using known keys) and the submission of transactions.
   *
   * @example
   * <BR>
   *
   * ```javascript
   * api.rpc.chain.subscribeNewHeads((header) => {
   *   console.log('new header', header);
   * });
   * ```
   */
  get rpc() {
    return assertResult(this._rpc);
  }

  /**
   * @description Contains the chain information for the current node.
   */
  get runtimeChain() {
    return assertResult(this._runtimeChain);
  }

  /**
   * @description Yields the current attached runtime metadata. Generally this is only used to construct extrinsics & storage, but is useful for current runtime inspection.
   */
  get runtimeMetadata() {
    return assertResult(this._runtimeMetadata);
  }

  /**
   * @description Contains the version information for the current runtime.
   */
  get runtimeVersion() {
    return assertResult(this._runtimeVersion);
  }

  /**
   * @description The underlying Rx API interface
   */
  get rx() {
    return assertResult(this._rx);
  }

  /**
   * @description Returns the underlying provider stats
   */
  get stats() {
    return this._rpcCore.provider.stats;
  }

  /**
   * @description The type of this API instance, either 'rxjs' or 'promise'
   */
  get type() {
    return this._type;
  }

  /**
   * @description Contains all the extrinsic modules and their subsequent methods in the API. It allows for the construction of transactions and the submission thereof. These are attached dynamically from the runtime metadata.
   *
   * @example
   * <BR>
   *
   * ```javascript
   * api.tx.balances
   *   .transfer(<recipientId>, <balance>)
   *   .signAndSend(<keyPair>, ({status}) => {
   *     console.log('tx status', status.asFinalized.toHex());
   *   });
   * ```
   */
  get tx() {
    return assertResult(this._extrinsics);
  }

  /**
   * @description Finds the definition for a specific [[CallFunction]] based on the index supplied
   */
  findCall(callIndex) {
    return findCall(this.registry, callIndex);
  }

  /**
   * @description Finds the definition for a specific [[RegistryError]] based on the index supplied
   */
  findError(errorIndex) {
    return findError(this.registry, errorIndex);
  }
}
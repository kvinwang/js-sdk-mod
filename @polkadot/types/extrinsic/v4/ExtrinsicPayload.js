// Copyright 2017-2022 @polkadot/types authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Enum, Struct } from '@polkadot/types-codec';
import { objectSpread } from '@polkadot/util';
import { sign } from "../util.js";

/**
 * @name GenericExtrinsicPayloadV4
 * @description
 * A signing payload for an [[Extrinsic]]. For the final encoding, it is
 * variable length based on the contents included
 */
export class GenericExtrinsicPayloadV4 extends Struct {
  #signOptions;
  constructor(registry, value) {
    super(registry, objectSpread({
      method: 'Bytes'
    }, registry.getSignedExtensionTypes(), registry.getSignedExtensionExtra()), value);

    // Do detection for the type of extrinsic, in the case of MultiSignature
    // this is an enum, in the case of AnySignature, this is a Hash only
    // (which may be 64 or 65 bytes)
    this.#signOptions = {
      withType: registry.createTypeUnsafe('ExtrinsicSignature', []) instanceof Enum
    };
  }

  /**
   * @description Returns a breakdown of the hex encoding for this Codec
   */
  inspect() {
    return super.inspect({
      method: true
    });
  }

  /**
   * @description The block [[Hash]] the signature applies to (mortal/immortal)
   */
  get blockHash() {
    return this.getT('blockHash');
  }

  /**
   * @description The [[ExtrinsicEra]]
   */
  get era() {
    return this.getT('era');
  }

  /**
   * @description The genesis [[Hash]] the signature applies to (mortal/immortal)
   */
  get genesisHash() {
    return this.getT('genesisHash');
  }

  /**
   * @description The [[Bytes]] contained in the payload
   */
  get method() {
    return this.getT('method');
  }

  /**
   * @description The [[Index]]
   */
  get nonce() {
    return this.getT('nonce');
  }

  /**
   * @description The specVersion for this signature
   */
  get specVersion() {
    return this.getT('specVersion');
  }

  /**
   * @description The tip [[Balance]]
   */
  get tip() {
    return this.getT('tip');
  }

  /**
   * @description The transactionVersion for this signature
   */
  get transactionVersion() {
    return this.getT('transactionVersion');
  }

  /**
   * @description
   * The (optional) asset id for this signature for chains that support transaction fees in assets
   */
  get assetId() {
    return this.getT('assetId');
  }

  /**
   * @description Sign the payload with the keypair
   */
  sign(signerPair) {
    // NOTE The `toU8a({ method: true })` argument is absolutely critical, we
    // don't want the method (Bytes) to have the length prefix included. This
    // means that the data-as-signed is un-decodable, but is also doesn't need
    // the extra information, only the pure data (and is not decoded) ...
    // The same applies to V1..V3, if we have a V5, carrythis comment
    return sign(this.registry, signerPair, this.toU8a({
      method: true
    }), this.#signOptions);
  }
}
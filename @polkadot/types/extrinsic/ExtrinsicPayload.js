// Copyright 2017-2022 @polkadot/types authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { AbstractBase } from '@polkadot/types-codec';
import { u8aToHex } from '@polkadot/util';
import { DEFAULT_VERSION } from "./constants.js";
const VERSIONS = ['ExtrinsicPayloadUnknown',
// v0 is unknown
'ExtrinsicPayloadUnknown', 'ExtrinsicPayloadUnknown', 'ExtrinsicPayloadUnknown', 'ExtrinsicPayloadV4'];

/** @internal */
function decodeExtrinsicPayload(registry, value, version = DEFAULT_VERSION) {
  if (value instanceof GenericExtrinsicPayload) {
    return value.unwrap();
  }
  return registry.createTypeUnsafe(VERSIONS[version] || VERSIONS[0], [value, {
    version
  }]);
}

/**
 * @name GenericExtrinsicPayload
 * @description
 * A signing payload for an [[Extrinsic]]. For the final encoding, it is variable length based
 * on the contents included
 */
export class GenericExtrinsicPayload extends AbstractBase {
  constructor(registry, value, {
    version
  } = {}) {
    super(registry, decodeExtrinsicPayload(registry, value, version));
  }

  /**
   * @description The block [[Hash]] the signature applies to (mortal/immortal)
   */
  get blockHash() {
    return this.inner.blockHash;
  }

  /**
   * @description The [[ExtrinsicEra]]
   */
  get era() {
    return this.inner.era;
  }

  /**
   * @description The genesis block [[Hash]] the signature applies to
   */
  get genesisHash() {
    // NOTE only v3+
    return this.inner.genesisHash || this.registry.createTypeUnsafe('Hash', []);
  }

  /**
   * @description The [[Raw]] contained in the payload
   */
  get method() {
    return this.inner.method;
  }

  /**
   * @description The [[Index]]
   */
  get nonce() {
    return this.inner.nonce;
  }

  /**
   * @description The specVersion as a [[u32]] for this payload
   */
  get specVersion() {
    // NOTE only v3+
    return this.inner.specVersion || this.registry.createTypeUnsafe('u32', []);
  }

  /**
   * @description The [[Balance]]
   */
  get tip() {
    // NOTE from v2+
    return this.inner.tip || this.registry.createTypeUnsafe('Compact<Balance>', []);
  }

  /**
   * @description The transaction version as a [[u32]] for this payload
   */
  get transactionVersion() {
    // NOTE only v4+
    return this.inner.transactionVersion || this.registry.createTypeUnsafe('u32', []);
  }

  /**
   * @description Compares the value of the input to see if there is a match
   */
  eq(other) {
    return this.inner.eq(other);
  }

  /**
   * @description Sign the payload with the keypair
   */
  sign(signerPair) {
    const signature = this.inner.sign(signerPair);

    // This is extensible, so we could quite readily extend to send back extra
    // information, such as for instance the payload, i.e. `payload: this.toHex()`
    // For the case here we sign via the extrinsic, we ignore the return, so generally
    // this is applicable for external signing
    return {
      signature: u8aToHex(signature)
    };
  }

  /**
   * @description Converts the Object to to a human-friendly JSON, with additional fields, expansion and formatting of information
   */
  toHuman(isExtended) {
    return this.inner.toHuman(isExtended);
  }

  /**
   * @description Converts the Object to JSON, typically used for RPC transfers
   */
  toJSON() {
    return this.toHex();
  }

  /**
   * @description Returns the string representation of the value
   */
  toString() {
    return this.toHex();
  }

  /**
   * @description Returns a serialized u8a form
   */
  toU8a(isBare) {
    // call our parent, with only the method stripped
    return super.toU8a(isBare ? {
      method: true
    } : false);
  }
}
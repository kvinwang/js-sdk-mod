// Copyright 2017-2022 @polkadot/types authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Struct } from '@polkadot/types-codec';
import { isU8a, isUndefined, objectProperties, objectSpread, stringify, u8aToHex } from '@polkadot/util';
import { EMPTY_U8A, IMMORTAL_ERA } from "../constants.js";
import { GenericExtrinsicPayloadV4 } from "./ExtrinsicPayload.js";

// Ensure we have enough data for all types of signatures
const FAKE_SIGNATURE = new Uint8Array(256).fill(1);
function toAddress(registry, address) {
  return registry.createTypeUnsafe('Address', [isU8a(address) ? u8aToHex(address) : address]);
}

/**
 * @name GenericExtrinsicSignatureV4
 * @description
 * A container for the [[Signature]] associated with a specific [[Extrinsic]]
 */
export class GenericExtrinsicSignatureV4 extends Struct {
  #signKeys;
  constructor(registry, value, {
    isSigned
  } = {}) {
    const signTypes = registry.getSignedExtensionTypes();
    super(registry, objectSpread(
    // eslint-disable-next-line sort-keys
    {
      signer: 'Address',
      signature: 'ExtrinsicSignature'
    }, signTypes), GenericExtrinsicSignatureV4.decodeExtrinsicSignature(value, isSigned));
    this.#signKeys = Object.keys(signTypes);
    objectProperties(this, this.#signKeys, k => this.get(k));
  }

  /** @internal */
  static decodeExtrinsicSignature(value, isSigned = false) {
    if (!value) {
      return EMPTY_U8A;
    } else if (value instanceof GenericExtrinsicSignatureV4) {
      return value;
    }
    return isSigned ? value : EMPTY_U8A;
  }

  /**
   * @description The length of the value when encoded as a Uint8Array
   */
  get encodedLength() {
    return this.isSigned ? super.encodedLength : 0;
  }

  /**
   * @description `true` if the signature is valid
   */
  get isSigned() {
    return !this.signature.isEmpty;
  }

  /**
   * @description The [[ExtrinsicEra]] (mortal or immortal) this signature applies to
   */
  get era() {
    return this.getT('era');
  }

  /**
   * @description The [[Index]] for the signature
   */
  get nonce() {
    return this.getT('nonce');
  }

  /**
   * @description The actual [[EcdsaSignature]], [[Ed25519Signature]] or [[Sr25519Signature]]
   */
  get signature() {
    // the second case here is when we don't have an enum signature, treat as raw
    return this.multiSignature.value || this.multiSignature;
  }

  /**
   * @description The raw [[ExtrinsicSignature]]
   */
  get multiSignature() {
    return this.getT('signature');
  }

  /**
   * @description The [[Address]] that signed
   */
  get signer() {
    return this.getT('signer');
  }

  /**
   * @description The [[Balance]] tip
   */
  get tip() {
    return this.getT('tip');
  }
  _injectSignature(signer, signature, payload) {
    // use the fields exposed to guide the getters
    for (let i = 0; i < this.#signKeys.length; i++) {
      const k = this.#signKeys[i];
      const v = payload.get(k);
      if (!isUndefined(v)) {
        this.set(k, v);
      }
    }

    // additional fields (exposed in struct itself)
    this.set('signer', signer);
    this.set('signature', signature);
    return this;
  }

  /**
   * @description Adds a raw signature
   */
  addSignature(signer, signature, payload) {
    return this._injectSignature(toAddress(this.registry, signer), this.registry.createTypeUnsafe('ExtrinsicSignature', [signature]), new GenericExtrinsicPayloadV4(this.registry, payload));
  }

  /**
   * @description Creates a payload from the supplied options
   */
  createPayload(method, options) {
    const {
      era,
      runtimeVersion: {
        specVersion,
        transactionVersion
      }
    } = options;
    return new GenericExtrinsicPayloadV4(this.registry, objectSpread({}, options, {
      era: era || IMMORTAL_ERA,
      method: method.toHex(),
      specVersion,
      transactionVersion
    }));
  }

  /**
   * @description Generate a payload and applies the signature from a keypair
   */
  sign(method, account, options) {
    if (!account || !account.addressRaw) {
      throw new Error(`Expected a valid keypair for signing, found ${stringify(account)}`);
    }
    const payload = this.createPayload(method, options);
    return this._injectSignature(toAddress(this.registry, account.addressRaw), this.registry.createTypeUnsafe('ExtrinsicSignature', [payload.sign(account)]), payload);
  }

  /**
   * @description Generate a payload and applies a fake signature
   */
  signFake(method, address, options) {
    if (!address) {
      throw new Error(`Expected a valid address for signing, found ${stringify(address)}`);
    }
    const payload = this.createPayload(method, options);
    return this._injectSignature(toAddress(this.registry, address), this.registry.createTypeUnsafe('ExtrinsicSignature', [FAKE_SIGNATURE]), payload);
  }

  /**
   * @description Encodes the value as a Uint8Array as per the SCALE specifications
   * @param isBare true when the value has none of the type-specific prefixes (internal)
   */
  toU8a(isBare) {
    return this.isSigned ? super.toU8a(isBare) : EMPTY_U8A;
  }
}
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GenericExtrinsicSignatureV4 = void 0;
var _typesCodec = require("@polkadot/types-codec");
var _util = require("@polkadot/util");
var _constants = require("../constants");
var _ExtrinsicPayload = require("./ExtrinsicPayload");
// Copyright 2017-2022 @polkadot/types authors & contributors
// SPDX-License-Identifier: Apache-2.0

// Ensure we have enough data for all types of signatures
const FAKE_SIGNATURE = new Uint8Array(256).fill(1);
function toAddress(registry, address) {
  return registry.createTypeUnsafe('Address', [(0, _util.isU8a)(address) ? (0, _util.u8aToHex)(address) : address]);
}

/**
 * @name GenericExtrinsicSignatureV4
 * @description
 * A container for the [[Signature]] associated with a specific [[Extrinsic]]
 */
class GenericExtrinsicSignatureV4 extends _typesCodec.Struct {
  #signKeys;
  constructor(registry, value) {
    let {
      isSigned
    } = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    const signTypes = registry.getSignedExtensionTypes();
    super(registry, (0, _util.objectSpread)(
    // eslint-disable-next-line sort-keys
    {
      signer: 'Address',
      signature: 'ExtrinsicSignature'
    }, signTypes), GenericExtrinsicSignatureV4.decodeExtrinsicSignature(value, isSigned));
    this.#signKeys = Object.keys(signTypes);
    (0, _util.objectProperties)(this, this.#signKeys, k => this.get(k));
  }

  /** @internal */
  static decodeExtrinsicSignature(value) {
    let isSigned = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    if (!value) {
      return _constants.EMPTY_U8A;
    } else if (value instanceof GenericExtrinsicSignatureV4) {
      return value;
    }
    return isSigned ? value : _constants.EMPTY_U8A;
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
      if (!(0, _util.isUndefined)(v)) {
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
    return this._injectSignature(toAddress(this.registry, signer), this.registry.createTypeUnsafe('ExtrinsicSignature', [signature]), new _ExtrinsicPayload.GenericExtrinsicPayloadV4(this.registry, payload));
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
    return new _ExtrinsicPayload.GenericExtrinsicPayloadV4(this.registry, (0, _util.objectSpread)({}, options, {
      era: era || _constants.IMMORTAL_ERA,
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
      throw new Error(`Expected a valid keypair for signing, found ${(0, _util.stringify)(account)}`);
    }
    const payload = this.createPayload(method, options);
    return this._injectSignature(toAddress(this.registry, account.addressRaw), this.registry.createTypeUnsafe('ExtrinsicSignature', [payload.sign(account)]), payload);
  }

  /**
   * @description Generate a payload and applies a fake signature
   */
  signFake(method, address, options) {
    if (!address) {
      throw new Error(`Expected a valid address for signing, found ${(0, _util.stringify)(address)}`);
    }
    const payload = this.createPayload(method, options);
    return this._injectSignature(toAddress(this.registry, address), this.registry.createTypeUnsafe('ExtrinsicSignature', [FAKE_SIGNATURE]), payload);
  }

  /**
   * @description Encodes the value as a Uint8Array as per the SCALE specifications
   * @param isBare true when the value has none of the type-specific prefixes (internal)
   */
  toU8a(isBare) {
    return this.isSigned ? super.toU8a(isBare) : _constants.EMPTY_U8A;
  }
}
exports.GenericExtrinsicSignatureV4 = GenericExtrinsicSignatureV4;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GenericExtrinsicV4 = exports.EXTRINSIC_VERSION = void 0;
var _typesCodec = require("@polkadot/types-codec");
var _util = require("@polkadot/util");
// Copyright 2017-2022 @polkadot/types authors & contributors
// SPDX-License-Identifier: Apache-2.0

const EXTRINSIC_VERSION = 4;
exports.EXTRINSIC_VERSION = EXTRINSIC_VERSION;
/**
 * @name GenericExtrinsicV4
 * @description
 * The third generation of compact extrinsics
 */
class GenericExtrinsicV4 extends _typesCodec.Struct {
  constructor(registry, value) {
    let {
      isSigned
    } = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    super(registry, {
      signature: 'ExtrinsicSignatureV4',
      // eslint-disable-next-line sort-keys
      method: 'Call'
    }, GenericExtrinsicV4.decodeExtrinsic(registry, value, isSigned));
  }

  /** @internal */
  static decodeExtrinsic(registry, value) {
    let isSigned = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    if (value instanceof GenericExtrinsicV4) {
      return value;
    } else if (value instanceof registry.createClassUnsafe('Call')) {
      return {
        method: value
      };
    } else if ((0, _util.isU8a)(value)) {
      // here we decode manually since we need to pull through the version information
      const signature = registry.createTypeUnsafe('ExtrinsicSignatureV4', [value, {
        isSigned
      }]);
      const method = registry.createTypeUnsafe('Call', [value.subarray(signature.encodedLength)]);
      return {
        method,
        signature
      };
    }
    return value || {};
  }

  /**
   * @description The length of the value when encoded as a Uint8Array
   */
  get encodedLength() {
    return this.toU8a().length;
  }

  /**
   * @description The [[Call]] this extrinsic wraps
   */
  get method() {
    return this.getT('method');
  }

  /**
   * @description The [[ExtrinsicSignatureV4]]
   */
  get signature() {
    return this.getT('signature');
  }

  /**
   * @description The version for the signature
   */
  get version() {
    return EXTRINSIC_VERSION;
  }

  /**
   * @description Add an [[ExtrinsicSignatureV4]] to the extrinsic (already generated)
   */
  addSignature(signer, signature, payload) {
    this.signature.addSignature(signer, signature, payload);
    return this;
  }

  /**
   * @description Sign the extrinsic with a specific keypair
   */
  sign(account, options) {
    this.signature.sign(this.method, account, options);
    return this;
  }

  /**
   * @describe Adds a fake signature to the extrinsic
   */
  signFake(signer, options) {
    this.signature.signFake(this.method, signer, options);
    return this;
  }
}
exports.GenericExtrinsicV4 = GenericExtrinsicV4;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GenericExtrinsic = void 0;
Object.defineProperty(exports, "LATEST_EXTRINSIC_VERSION", {
  enumerable: true,
  get: function () {
    return _Extrinsic.EXTRINSIC_VERSION;
  }
});
var _typesCodec = require("@polkadot/types-codec");
var _util = require("@polkadot/util");
var _Extrinsic = require("./v4/Extrinsic");
var _constants = require("./constants");
// Copyright 2017-2022 @polkadot/types authors & contributors
// SPDX-License-Identifier: Apache-2.0

const VERSIONS = ['ExtrinsicUnknown',
// v0 is unknown
'ExtrinsicUnknown', 'ExtrinsicUnknown', 'ExtrinsicUnknown', 'ExtrinsicV4'];
/** @internal */
function newFromValue(registry, value, version) {
  if (value instanceof GenericExtrinsic) {
    return value.unwrap();
  }
  const isSigned = (version & _constants.BIT_SIGNED) === _constants.BIT_SIGNED;
  const type = VERSIONS[version & _constants.UNMASK_VERSION] || VERSIONS[0];

  // we cast here since the VERSION definition is incredibly broad - we don't have a
  // slice for "only add extrinsic types", and more string definitions become unwieldy
  return registry.createTypeUnsafe(type, [value, {
    isSigned,
    version
  }]);
}

/** @internal */
function decodeExtrinsic(registry, value) {
  let version = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _constants.DEFAULT_VERSION;
  if ((0, _util.isU8a)(value) || Array.isArray(value) || (0, _util.isHex)(value)) {
    return decodeU8a(registry, (0, _util.u8aToU8a)(value), version);
  } else if (value instanceof registry.createClassUnsafe('Call')) {
    return newFromValue(registry, {
      method: value
    }, version);
  }
  return newFromValue(registry, value, version);
}

/** @internal */
function decodeU8a(registry, value, version) {
  if (!value.length) {
    return newFromValue(registry, new Uint8Array(), version);
  }
  const [offset, length] = (0, _util.compactFromU8a)(value);
  const total = offset + length.toNumber();
  if (total > value.length) {
    throw new Error(`Extrinsic: length less than remainder, expected at least ${total}, found ${value.length}`);
  }
  const data = value.subarray(offset, total);
  return newFromValue(registry, data.subarray(1), data[0]);
}
class ExtrinsicBase extends _typesCodec.AbstractBase {
  constructor(registry, value, initialU8aLength) {
    super(registry, value, initialU8aLength);
    const signKeys = Object.keys(registry.getSignedExtensionTypes());
    const getter = key => this.inner.signature[key];

    // This is on the abstract class, ensuring that hasOwnProperty operates
    // correctly, i.e. it needs to be on the base class exposing it
    for (let i = 0; i < signKeys.length; i++) {
      (0, _util.objectProperty)(this, signKeys[i], getter);
    }
  }

  /**
   * @description The arguments passed to for the call, exposes args so it is compatible with [[Call]]
   */
  get args() {
    return this.method.args;
  }

  /**
   * @description The argument definitions, compatible with [[Call]]
   */
  get argsDef() {
    return this.method.argsDef;
  }

  /**
   * @description The actual `[sectionIndex, methodIndex]` as used in the Call
   */
  get callIndex() {
    return this.method.callIndex;
  }

  /**
   * @description The actual data for the Call
   */
  get data() {
    return this.method.data;
  }

  /**
   * @description The era for this extrinsic
   */
  get era() {
    return this.inner.signature.era;
  }

  /**
   * @description The length of the value when encoded as a Uint8Array
   */
  get encodedLength() {
    return this.toU8a().length;
  }

  /**
   * @description `true` id the extrinsic is signed
   */
  get isSigned() {
    return this.inner.signature.isSigned;
  }

  /**
   * @description The length of the actual data, excluding prefix
   */
  get length() {
    return this.toU8a(true).length;
  }

  /**
   * @description The [[FunctionMetadataLatest]] that describes the extrinsic
   */
  get meta() {
    return this.method.meta;
  }

  /**
   * @description The [[Call]] this extrinsic wraps
   */
  get method() {
    return this.inner.method;
  }

  /**
   * @description The nonce for this extrinsic
   */
  get nonce() {
    return this.inner.signature.nonce;
  }

  /**
   * @description The actual [[EcdsaSignature]], [[Ed25519Signature]] or [[Sr25519Signature]]
   */
  get signature() {
    return this.inner.signature.signature;
  }

  /**
   * @description The [[Address]] that signed
   */
  get signer() {
    return this.inner.signature.signer;
  }

  /**
   * @description Forwards compat
   */
  get tip() {
    return this.inner.signature.tip;
  }

  /**
   * @description Returns the raw transaction version (not flagged with signing information)
  */
  get type() {
    return this.inner.version;
  }
  get inner() {
    return this.unwrap();
  }

  /**
   * @description Returns the encoded version flag
  */
  get version() {
    return this.type | (this.isSigned ? _constants.BIT_SIGNED : _constants.BIT_UNSIGNED);
  }

  /**
   * @description Checks if the source matches this in type
   */
  is(other) {
    return this.method.is(other);
  }
  unwrap() {
    return super.unwrap();
  }
}

/**
 * @name GenericExtrinsic
 * @description
 * Representation of an Extrinsic in the system. It contains the actual call,
 * (optional) signature and encodes with an actual length prefix
 *
 * {@link https://github.com/paritytech/wiki/blob/master/Extrinsic.md#the-extrinsic-format-for-node}.
 *
 * Can be:
 * - signed, to create a transaction
 * - left as is, to create an inherent
 */
class GenericExtrinsic extends ExtrinsicBase {
  #hashCache;
  static LATEST_EXTRINSIC_VERSION = _Extrinsic.EXTRINSIC_VERSION;
  constructor(registry, value) {
    let {
      version
    } = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    super(registry, decodeExtrinsic(registry, value, version));
  }

  /**
   * @description returns a hash of the contents
   */
  get hash() {
    if (!this.#hashCache) {
      this.#hashCache = super.hash;
    }
    return this.#hashCache;
  }

  /**
   * @description Injects an already-generated signature into the extrinsic
   */
  addSignature(signer, signature, payload) {
    this.inner.addSignature(signer, signature, payload);
    this.#hashCache = undefined;
    return this;
  }

  /**
   * @description Returns a breakdown of the hex encoding for this Codec
   */
  inspect() {
    const encoded = (0, _util.u8aConcat)(...this.toU8aInner());
    return {
      inner: this.isSigned ? this.inner.inspect().inner : this.inner.method.inspect().inner,
      outer: [(0, _util.compactToU8a)(encoded.length), new Uint8Array([this.version])]
    };
  }

  /**
   * @description Sign the extrinsic with a specific keypair
   */
  sign(account, options) {
    this.inner.sign(account, options);
    this.#hashCache = undefined;
    return this;
  }

  /**
   * @describe Adds a fake signature to the extrinsic
   */
  signFake(signer, options) {
    this.inner.signFake(signer, options);
    this.#hashCache = undefined;
    return this;
  }

  /**
   * @description Returns a hex string representation of the value
   */
  toHex(isBare) {
    return (0, _util.u8aToHex)(this.toU8a(isBare));
  }

  /**
   * @description Converts the Object to to a human-friendly JSON, with additional fields, expansion and formatting of information
   */
  toHuman(isExpanded) {
    return (0, _util.objectSpread)({}, {
      isSigned: this.isSigned,
      method: this.method.toHuman(isExpanded)
    }, this.isSigned ? {
      era: this.era.toHuman(isExpanded),
      nonce: this.nonce.toHuman(isExpanded),
      signature: this.signature.toHex(),
      signer: this.signer.toHuman(isExpanded),
      tip: this.tip.toHuman(isExpanded)
    } : null);
  }

  /**
   * @description Converts the Object to JSON, typically used for RPC transfers
   */
  toJSON() {
    return this.toHex();
  }

  /**
   * @description Returns the base runtime type name for this instance
   */
  toRawType() {
    return 'Extrinsic';
  }

  /**
   * @description Encodes the value as a Uint8Array as per the SCALE specifications
   * @param isBare true when the value is not length-prefixed
   */
  toU8a(isBare) {
    const encoded = (0, _util.u8aConcat)(...this.toU8aInner());
    return isBare ? encoded : (0, _util.compactAddLength)(encoded);
  }
  toU8aInner() {
    // we do not apply bare to the internal values, rather this only determines out length addition,
    // where we strip all lengths this creates an extrinsic that cannot be decoded
    return [new Uint8Array([this.version]), this.inner.toU8a()];
  }
}
exports.GenericExtrinsic = GenericExtrinsic;
// Copyright 2017-2022 @polkadot/types authors & contributors
// SPDX-License-Identifier: Apache-2.0
import { AbstractBase } from '@polkadot/types-codec';
import { isBigInt, isBn, isHex, isNumber, isU8a, u8aConcat, u8aToBn, u8aToHex, u8aToU8a } from '@polkadot/util';
import { decodeAddress } from '@polkadot/util-crypto';
import { GenericAccountId } from "./AccountId.js";
import { GenericAccountIndex } from "./AccountIndex.js"; // eslint-disable-next-line no-use-before-define

export const ACCOUNT_ID_PREFIX = new Uint8Array([0xff]);
/** @internal */

function decodeString(registry, value) {
  const decoded = decodeAddress(value);
  return decoded.length === 32 ? registry.createTypeUnsafe('AccountId', [decoded]) : registry.createTypeUnsafe('AccountIndex', [u8aToBn(decoded)]);
}
/** @internal */


function decodeU8a(registry, value) {
  // This allows us to instantiate an address with a raw publicKey. Do this first before
  // we checking the first byte, otherwise we may split an already-existent valid address
  if (value.length === 32) {
    return registry.createTypeUnsafe('AccountId', [value]);
  } else if (value[0] === 0xff) {
    return registry.createTypeUnsafe('AccountId', [value.subarray(1)]);
  }

  const [offset, length] = GenericAccountIndex.readLength(value);
  return registry.createTypeUnsafe('AccountIndex', [u8aToBn(value.subarray(offset, offset + length))]);
}
/** @internal */


function decodeAddressOrIndex(registry, value) {
  return value instanceof GenericLookupSource ? value.inner : value instanceof GenericAccountId || value instanceof GenericAccountIndex ? value : isBn(value) || isNumber(value) || isBigInt(value) ? registry.createTypeUnsafe('AccountIndex', [value]) : Array.isArray(value) || isHex(value) || isU8a(value) ? decodeU8a(registry, u8aToU8a(value)) : decodeString(registry, value);
}
/**
 * @name LookupSource
 * @description
 * A wrapper around an AccountId and/or AccountIndex that is encoded with a prefix.
 * Since we are dealing with underlying publicKeys (or shorter encoded addresses),
 * we extend from Base with an AccountId/AccountIndex wrapper. Basically the Address
 * is encoded as `[ <prefix-byte>, ...publicKey/...bytes ]` as per spec
 */


export class GenericLookupSource extends AbstractBase {
  constructor(registry, value = new Uint8Array()) {
    super(registry, decodeAddressOrIndex(registry, value));
  }
  /**
   * @description The length of the value when encoded as a Uint8Array
   */


  get encodedLength() {
    const rawLength = this._rawLength;
    return rawLength + ( // for 1 byte AccountIndexes, we are not adding a specific prefix
    rawLength > 1 ? 1 : 0);
  }
  /**
   * @description The length of the raw value, either AccountIndex or AccountId
   */


  get _rawLength() {
    return this.inner instanceof GenericAccountIndex ? GenericAccountIndex.calcLength(this.inner) : this.inner.encodedLength;
  }
  /**
   * @description Returns a breakdown of the hex encoding for this Codec
   */


  inspect() {
    const value = this.inner.toU8a().subarray(0, this._rawLength);
    return {
      outer: [new Uint8Array(this.inner instanceof GenericAccountIndex ? GenericAccountIndex.writeLength(value) : ACCOUNT_ID_PREFIX), value]
    };
  }
  /**
   * @description Returns a hex string representation of the value
   */


  toHex() {
    return u8aToHex(this.toU8a());
  }
  /**
   * @description Returns the base runtime type name for this instance
   */


  toRawType() {
    return 'Address';
  }
  /**
   * @description Encodes the value as a Uint8Array as per the SCALE specifications
   * @param isBare true when the value has none of the type-specific prefixes (internal)
   */


  toU8a(isBare) {
    const encoded = this.inner.toU8a().subarray(0, this._rawLength);
    return isBare ? encoded : u8aConcat(this.inner instanceof GenericAccountIndex ? GenericAccountIndex.writeLength(encoded) : ACCOUNT_ID_PREFIX, encoded);
  }

}
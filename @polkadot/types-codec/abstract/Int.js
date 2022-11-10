// Copyright 2017-2022 @polkadot/types-codec authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { BN, BN_BILLION, BN_HUNDRED, BN_MILLION, BN_QUINTILL, bnToBn, bnToHex, bnToU8a, formatBalance, formatNumber, hexToBn, isBn, isFunction, isHex, isNumber, isObject, isString, isU8a, u8aToBn, u8aToNumber } from '@polkadot/util';
export const DEFAULT_UINT_BITS = 64;

// Maximum allowed integer for JS is 2^53 - 1, set limit at 52
// In this case however, we always print any >32 as hex
const MAX_NUMBER_BITS = 52;
const MUL_P = new BN(10000);
const FORMATTERS = [['Perquintill', BN_QUINTILL], ['Perbill', BN_BILLION], ['Permill', BN_MILLION], ['Percent', BN_HUNDRED]];
function toPercentage(value, divisor) {
  return `${(value.mul(MUL_P).div(divisor).toNumber() / 100).toFixed(2)}%`;
}

/** @internal */
function decodeAbstractInt(value, isNegative) {
  if (isNumber(value)) {
    if (!Number.isInteger(value) || value > Number.MAX_SAFE_INTEGER || value < Number.MIN_SAFE_INTEGER) {
      throw new Error('Number needs to be an integer <= Number.MAX_SAFE_INTEGER, i.e. 2 ^ 53 - 1');
    }
    return value;
  } else if (isString(value)) {
    if (isHex(value, -1, true)) {
      return hexToBn(value, {
        isLe: false,
        isNegative
      }).toString();
    }
    if (value.includes('.') || value.includes(',') || value.includes('e')) {
      throw new Error('String should not contain decimal points or scientific notation');
    }
    return value;
  } else if (isBn(value)) {
    return value.toString();
  } else if (isObject(value) && !isFunction(value.toBn)) {
    // Allow the construction from an object with a single top-level key. This means that
    // single key objects can be treated equivalently to numbers, assuming they meet the
    // specific requirements. (This is useful in Weights 1.5 where Objects are compact)
    const keys = Object.keys(value);
    if (keys.length !== 1) {
      throw new Error('Unable to construct number from multi-key object');
    }
    const inner = value[keys[0]];
    if (!isString(inner) && !isNumber(inner)) {
      throw new Error('Unable to construct from object with non-string/non-number value');
    }
    return decodeAbstractInt(inner, isNegative);
  }
  return bnToBn(value).toString();
}

/**
 * @name AbstractInt
 * @ignore
 * @noInheritDoc
 */
export class AbstractInt extends BN {
  #bitLength;
  constructor(registry, value = 0, bitLength = DEFAULT_UINT_BITS, isSigned = false) {
    // Construct via a string/number, which will be passed in the BN constructor.
    // It would be ideal to actually return a BN, but there is an issue:
    // https://github.com/indutny/bn.js/issues/206
    super(
    // shortcut isU8a as used in SCALE decoding
    isU8a(value) ? bitLength <= 48 ? u8aToNumber(value.subarray(0, bitLength / 8), {
      isNegative: isSigned
    }) : u8aToBn(value.subarray(0, bitLength / 8), {
      isLe: true,
      isNegative: isSigned
    }).toString() : decodeAbstractInt(value, isSigned));
    this.registry = registry;
    this.#bitLength = bitLength;
    this.encodedLength = this.#bitLength / 8;
    this.isUnsigned = !isSigned;
    const isNegative = this.isNeg();
    const maxBits = bitLength - (isSigned && !isNegative ? 1 : 0);
    if (isNegative && !isSigned) {
      throw new Error(`${this.toRawType()}: Negative number passed to unsigned type`);
    } else if (super.bitLength() > maxBits) {
      throw new Error(`${this.toRawType()}: Input too large. Found input with ${super.bitLength()} bits, expected ${maxBits}`);
    }
  }

  /**
   * @description returns a hash of the contents
   */
  get hash() {
    return this.registry.hash(this.toU8a());
  }

  /**
   * @description Checks if the value is a zero value (align elsewhere)
   */
  get isEmpty() {
    return this.isZero();
  }

  /**
   * @description Returns the number of bits in the value
   */
  bitLength() {
    return this.#bitLength;
  }

  /**
   * @description Compares the value of the input to see if there is a match
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  eq(other) {
    // Here we are actually overriding the built-in .eq to take care of both
    // number and BN inputs (no `.eqn` needed) - numbers will be converted
    return super.eq(isHex(other) ? hexToBn(other.toString(), {
      isLe: false,
      isNegative: !this.isUnsigned
    }) : bnToBn(other));
  }

  /**
   * @description Returns a breakdown of the hex encoding for this Codec
   */
  inspect() {
    return {
      outer: [this.toU8a()]
    };
  }

  /**
   * @description True if this value is the max of the type
   */
  isMax() {
    const u8a = this.toU8a().filter(b => b === 0xff);
    return u8a.length === this.#bitLength / 8;
  }

  /**
   * @description Returns a BigInt representation of the number
   */
  toBigInt() {
    return BigInt(this.toString());
  }

  /**
   * @description Returns the BN representation of the number. (Compatibility)
   */
  toBn() {
    return this;
  }

  /**
   * @description Returns a hex string representation of the value
   */
  toHex(isLe = false) {
    // For display/JSON, this is BE, for compare, use isLe
    return bnToHex(this, {
      bitLength: this.bitLength(),
      isLe,
      isNegative: !this.isUnsigned
    });
  }

  /**
   * @description Converts the Object to to a human-friendly JSON, with additional fields, expansion and formatting of information
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  toHuman(isExpanded) {
    const rawType = this.toRawType();
    if (rawType === 'Balance') {
      return this.isMax() ? 'everything'
      // FIXME In the case of multiples we need some way of detecting which instance this belongs
      // to. as it stands we will always format (incorrectly) against the first token defined
      : formatBalance(this, {
        decimals: this.registry.chainDecimals[0],
        withSi: true,
        withUnit: this.registry.chainTokens[0]
      });
    }
    const [, divisor] = FORMATTERS.find(([type]) => type === rawType) || [];
    return divisor ? toPercentage(this, divisor) : formatNumber(this);
  }

  /**
   * @description Converts the Object to JSON, typically used for RPC transfers
   */
  toJSON(onlyHex = false) {
    // FIXME this return type should by string | number, however BN returns string
    // Options here are
    //   - super.bitLength() - the actual used bits
    //   - this.#bitLength - the type bits (this should be used, however contracts RPC is problematic)
    return onlyHex || super.bitLength() > MAX_NUMBER_BITS ? this.toHex() : this.toNumber();
  }

  /**
   * @description Returns the value in a primitive form, either number when <= 52 bits, or string otherwise
   */
  toPrimitive() {
    return super.bitLength() > MAX_NUMBER_BITS ? this.toString() : this.toNumber();
  }

  /**
   * @description Returns the base runtime type name for this instance
   */
  toRawType() {
    // NOTE In the case of balances, which have a special meaning on the UI
    // and can be interpreted differently, return a specific value for it so
    // underlying it always matches (no matter which length it actually is)
    return this instanceof this.registry.createClassUnsafe('Balance') ? 'Balance' : `${this.isUnsigned ? 'u' : 'i'}${this.bitLength()}`;
  }

  /**
   * @description Returns the string representation of the value
   * @param base The base to use for the conversion
   */
  toString(base) {
    // only included here since we do not inherit docs
    return super.toString(base);
  }

  /**
   * @description Encodes the value as a Uint8Array as per the SCALE specifications
   * @param isBare true when the value has none of the type-specific prefixes (internal)
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  toU8a(isBare) {
    return bnToU8a(this, {
      bitLength: this.bitLength(),
      isLe: true,
      isNegative: !this.isUnsigned
    });
  }
}
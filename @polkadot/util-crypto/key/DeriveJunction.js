// Copyright 2017-2022 @polkadot/util-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { BN, bnToU8a, compactAddLength, hexToU8a, isBigInt, isBn, isHex, isNumber, isString, stringToU8a } from '@polkadot/util';
import { blake2AsU8a } from "../blake2/asU8a.js";
import { BN_LE_256_OPTS } from "../bn.js";
const RE_NUMBER = /^\d+$/;
const JUNCTION_ID_LEN = 32;
export class DeriveJunction {
  #chainCode = new Uint8Array(32);
  #isHard = false;
  static from(value) {
    const result = new DeriveJunction();
    const [code, isHard] = value.startsWith('/') ? [value.substring(1), true] : [value, false];
    result.soft(RE_NUMBER.test(code) ? new BN(code, 10) : code);
    return isHard ? result.harden() : result;
  }
  get chainCode() {
    return this.#chainCode;
  }
  get isHard() {
    return this.#isHard;
  }
  get isSoft() {
    return !this.#isHard;
  }
  hard(value) {
    return this.soft(value).harden();
  }
  harden() {
    this.#isHard = true;
    return this;
  }
  soft(value) {
    if (isNumber(value) || isBn(value) || isBigInt(value)) {
      return this.soft(bnToU8a(value, BN_LE_256_OPTS));
    } else if (isHex(value)) {
      return this.soft(hexToU8a(value));
    } else if (isString(value)) {
      return this.soft(compactAddLength(stringToU8a(value)));
    } else if (value.length > JUNCTION_ID_LEN) {
      return this.soft(blake2AsU8a(value));
    }
    this.#chainCode.fill(0);
    this.#chainCode.set(value, 0);
    return this;
  }
  soften() {
    this.#isHard = false;
    return this;
  }
}
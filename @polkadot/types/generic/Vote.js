// Copyright 2017-2022 @polkadot/types authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Bool, U8aFixed } from '@polkadot/types-codec';
import { isBoolean, isNumber, isU8a, isUndefined } from '@polkadot/util';
// For votes, the topmost bit indicated aye/nay, the lower bits indicate the conviction
const AYE_BITS = 0b10000000;
const NAY_BITS = 0b00000000;
const CON_MASK = 0b01111111;
const DEF_CONV = 0b00000000; // the default conviction, None

/** @internal */
function decodeVoteBool(value) {
  return value ? new Uint8Array([AYE_BITS | DEF_CONV]) : new Uint8Array([NAY_BITS]);
}

/** @internal */
function decodeVoteU8a(value) {
  return value.length ? value.subarray(0, 1) : new Uint8Array([NAY_BITS]);
}

/** @internal */
function decodeVoteType(registry, value) {
  return new Uint8Array([(new Bool(registry, value.aye).isTrue ? AYE_BITS : NAY_BITS) | registry.createTypeUnsafe('Conviction', [value.conviction || DEF_CONV]).index]);
}

/** @internal */
function decodeVote(registry, value) {
  if (isU8a(value)) {
    return decodeVoteU8a(value);
  } else if (isUndefined(value) || value instanceof Boolean || isBoolean(value)) {
    return decodeVoteBool(new Bool(registry, value).isTrue);
  } else if (isNumber(value)) {
    return decodeVoteBool(value < 0);
  }
  return decodeVoteType(registry, value);
}

/**
 * @name GenericVote
 * @description
 * A number of lock periods, plus a vote, one way or the other.
 */
export class GenericVote extends U8aFixed {
  #aye;
  #conviction;
  constructor(registry, value) {
    // decoded is just 1 byte
    // Aye: Most Significant Bit
    // Conviction: 0000 - 0101
    const decoded = decodeVote(registry, value);
    super(registry, decoded, 8);
    this.#aye = (decoded[0] & AYE_BITS) === AYE_BITS;
    this.#conviction = this.registry.createTypeUnsafe('Conviction', [decoded[0] & CON_MASK]);
  }

  /**
   * @description returns a V2 conviction
   */
  get conviction() {
    return this.#conviction;
  }

  /**
   * @description true if the wrapped value is a positive vote
   */
  get isAye() {
    return this.#aye;
  }

  /**
   * @description true if the wrapped value is a negative vote
   */
  get isNay() {
    return !this.isAye;
  }

  /**
   * @description Converts the Object to to a human-friendly JSON, with additional fields, expansion and formatting of information
   */
  toHuman(isExpanded) {
    return {
      conviction: this.conviction.toHuman(isExpanded),
      vote: this.isAye ? 'Aye' : 'Nay'
    };
  }

  /**
   * @description Converts the value in a best-fit primitive form
   */
  toPrimitive() {
    return {
      aye: this.isAye,
      conviction: this.conviction.toPrimitive()
    };
  }

  /**
   * @description Returns the base runtime type name for this instance
   */
  toRawType() {
    return 'Vote';
  }
}
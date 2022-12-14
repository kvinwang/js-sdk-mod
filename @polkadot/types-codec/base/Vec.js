// Copyright 2017-2022 @polkadot/types-codec authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { compactFromU8aLim, isU8a, logger, u8aToU8a } from '@polkadot/util';
import { AbstractArray } from "../abstract/Array.js";
import { decodeU8aVec, typeToConstructor } from "../utils/index.js";
const MAX_LENGTH = 64 * 1024;
const l = logger('Vec');
function noopSetDefinition(d) {
  return d;
}
function decodeVecLength(value) {
  if (Array.isArray(value)) {
    return [value, value.length, 0];
  }
  const u8a = u8aToU8a(value);
  const [startAt, length] = compactFromU8aLim(u8a);
  if (length > MAX_LENGTH) {
    throw new Error(`Vec length ${length.toString()} exceeds ${MAX_LENGTH}`);
  }
  return [u8a, length, startAt];
}
export function decodeVec(registry, result, value, startAt, Type) {
  if (Array.isArray(value)) {
    const count = result.length;
    for (let i = 0; i < count; i++) {
      // 26/08/2022 this is actually a false positive - after recent eslint upgdates
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const entry = value[i];
      try {
        result[i] = entry instanceof Type ? entry : new Type(registry, entry);
      } catch (error) {
        l.error(`Unable to decode on index ${i}`, error.message);
        throw error;
      }
    }
    return [0, 0];
  }
  return decodeU8aVec(registry, result, u8aToU8a(value), startAt, Type);
}

/**
 * @name Vec
 * @description
 * This manages codec arrays. Internally it keeps track of the length (as decoded) and allows
 * construction with the passed `Type` in the constructor. It is an extension to Array, providing
 * specific encoding/decoding on top of the base type.
 */
export class Vec extends AbstractArray {
  #Type;
  constructor(registry, Type, value = [], {
    definition,
    setDefinition = noopSetDefinition
  } = {}) {
    const [decodeFrom, length, startAt] = decodeVecLength(value);
    super(registry, length);
    this.#Type = definition || setDefinition(typeToConstructor(registry, Type));
    this.initialU8aLength = (isU8a(decodeFrom) ? decodeU8aVec(registry, this, decodeFrom, startAt, this.#Type) : decodeVec(registry, this, decodeFrom, startAt, this.#Type))[0];
  }
  static with(Type) {
    let definition;

    // eslint-disable-next-line no-return-assign
    const setDefinition = d => definition = d;
    return class extends Vec {
      constructor(registry, value) {
        super(registry, Type, value, {
          definition,
          setDefinition
        });
      }
    };
  }

  /**
   * @description The type for the items
   */
  get Type() {
    return this.#Type.name;
  }

  /**
   * @description Finds the index of the value in the array
   */
  indexOf(_other) {
    // convert type first, this removes overhead from the eq
    const other = _other instanceof this.#Type ? _other : new this.#Type(this.registry, _other);
    for (let i = 0; i < this.length; i++) {
      if (other.eq(this[i])) {
        return i;
      }
    }
    return -1;
  }

  /**
   * @description Returns the base runtime type name for this instance
   */
  toRawType() {
    return `Vec<${this.registry.getClassName(this.#Type) || new this.#Type(this.registry).toRawType()}>`;
  }
}
// Copyright 2017-2022 @polkadot/types-codec authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { isBoolean, isFunction, isHex, isObject, isU8a, isUndefined, objectProperties, stringCamelCase, stringify, u8aConcatStrict, u8aToHex, u8aToU8a } from '@polkadot/util';
import { compareMap, decodeU8aStruct, mapToTypeMap, typesToMap } from "../utils/index.js";
function noopSetDefinition(d) {
  return d;
}

/** @internal */
function decodeStructFromObject(registry, [Types, keys], value, jsonMap) {
  let jsonObj;
  const typeofArray = Array.isArray(value);
  const typeofMap = value instanceof Map;
  if (!typeofArray && !typeofMap && !isObject(value)) {
    throw new Error(`Struct: Cannot decode value ${stringify(value)} (typeof ${typeof value}), expected an input object, map or array`);
  } else if (typeofArray && value.length !== keys.length) {
    throw new Error(`Struct: Unable to map ${stringify(value)} array to object with known keys ${keys.join(', ')}`);
  }
  const raw = new Array(keys.length);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const jsonKey = jsonMap.get(key) || key;
    const Type = Types[i];
    let assign;
    try {
      if (typeofArray) {
        assign = value[i];
      } else if (typeofMap) {
        assign = jsonKey && value.get(jsonKey);
      } else {
        assign = jsonKey && value[jsonKey];
        if (isUndefined(assign)) {
          if (isUndefined(jsonObj)) {
            const entries = Object.entries(value);
            jsonObj = {};
            for (let e = 0; e < entries.length; e++) {
              jsonObj[stringCamelCase(entries[e][0])] = entries[e][1];
            }
          }
          assign = jsonKey && jsonObj[jsonKey];
        }
      }
      raw[i] = [key, assign instanceof Type ? assign : new Type(registry, assign)];
    } catch (error) {
      let type = Type.name;
      try {
        type = new Type(registry).toRawType();
      } catch (error) {
        // ignore
      }
      throw new Error(`Struct: failed on ${jsonKey}: ${type}:: ${error.message}`);
    }
  }
  return [raw, 0];
}

/**
 * @name Struct
 * @description
 * A Struct defines an Object with key-value pairs - where the values are Codec values. It removes
 * a lot of repetition from the actual coding, define a structure type, pass it the key/Codec
 * values in the constructor and it manages the decoding. It is important that the constructor
 * values matches 100% to the order in th Rust code, i.e. don't go crazy and make it alphabetical,
 * it needs to decoded in the specific defined order.
 * @noInheritDoc
 */
export class Struct extends Map {
  #jsonMap;
  #Types;
  constructor(registry, Types, value, jsonMap = new Map(), {
    definition,
    setDefinition = noopSetDefinition
  } = {}) {
    const typeMap = definition || setDefinition(mapToTypeMap(registry, Types));
    const [decoded, decodedLength] = isU8a(value) || isHex(value) ? decodeU8aStruct(registry, new Array(typeMap[0].length), u8aToU8a(value), typeMap) : value instanceof Struct ? [value, 0] : decodeStructFromObject(registry, typeMap, value || {}, jsonMap);
    super(decoded);
    this.initialU8aLength = decodedLength;
    this.registry = registry;
    this.#jsonMap = jsonMap;
    this.#Types = typeMap;
  }
  static with(Types, jsonMap) {
    var _class;
    let definition;

    // eslint-disable-next-line no-return-assign
    const setDefinition = d => definition = d;
    return _class = class extends Struct {
      constructor(registry, value) {
        super(registry, Types, value, jsonMap, {
          definition,
          setDefinition
        });
      }
    }, (() => {
      const keys = Object.keys(Types);
      objectProperties(_class.prototype, keys, (k, _, self) => self.get(k));
    })(), _class;
  }

  /**
   * @description The available keys for this struct
   */
  get defKeys() {
    return this.#Types[1];
  }

  /**
   * @description Checks if the value is an empty value
   */
  get isEmpty() {
    for (const v of this.values()) {
      if (!v.isEmpty) {
        return false;
      }
    }
    return true;
  }

  /**
   * @description The length of the value when encoded as a Uint8Array
   */
  get encodedLength() {
    let total = 0;
    for (const v of this.values()) {
      total += v.encodedLength;
    }
    return total;
  }

  /**
   * @description returns a hash of the contents
   */
  get hash() {
    return this.registry.hash(this.toU8a());
  }

  /**
   * @description Returns the Type description of the structure
   */
  get Type() {
    const result = {};
    const [Types, keys] = this.#Types;
    for (let i = 0; i < keys.length; i++) {
      result[keys[i]] = new Types[i](this.registry).toRawType();
    }
    return result;
  }

  /**
   * @description Compares the value of the input to see if there is a match
   */
  eq(other) {
    return compareMap(this, other);
  }

  /**
   * @description Returns a specific names entry in the structure
   * @param key The name of the entry to retrieve
   */
  get(key) {
    return super.get(key);
  }

  /**
   * @description Returns the values of a member at a specific index (Rather use get(name) for performance)
   */
  getAtIndex(index) {
    return this.toArray()[index];
  }

  /**
   * @description Returns the a types value by name
   */
  getT(key) {
    return super.get(key);
  }

  /**
   * @description Returns a breakdown of the hex encoding for this Codec
   */
  inspect(isBare) {
    const inner = new Array();
    for (const [k, v] of this.entries()) {
      inner.push({
        ...v.inspect(!isBare || isBoolean(isBare) ? isBare : isBare[k]),
        name: stringCamelCase(k)
      });
    }
    return {
      inner
    };
  }

  /**
   * @description Converts the Object to an standard JavaScript Array
   */
  toArray() {
    return [...this.values()];
  }

  /**
   * @description Returns a hex string representation of the value
   */
  toHex() {
    return u8aToHex(this.toU8a());
  }

  /**
   * @description Converts the Object to to a human-friendly JSON, with additional fields, expansion and formatting of information
   */
  toHuman(isExtended) {
    const json = {};
    for (const [k, v] of this.entries()) {
      json[k] = v && v.toHuman(isExtended);
    }
    return json;
  }

  /**
   * @description Converts the Object to JSON, typically used for RPC transfers
   */
  toJSON() {
    const json = {};
    for (const [k, v] of this.entries()) {
      const jsonKey = this.#jsonMap.get(k) || k;

      // We actually log inside the U8a decoding and use JSON.stringify(...), which
      // means that the Vec may be partially populated (same applies to toHuman, same check)
      json[jsonKey] = v && v.toJSON();
    }
    return json;
  }

  /**
   * @description Converts the value in a best-fit primitive form
   */
  toPrimitive() {
    const json = {};
    for (const [k, v] of this.entries()) {
      const jsonKey = this.#jsonMap.get(k) || k;

      // We actually log inside the U8a decoding and use JSON.stringify(...), which
      // means that the Vec may be partially populated (same applies to toHuman, same check)
      json[jsonKey] = v && v.toPrimitive();
    }
    return json;
  }

  /**
   * @description Returns the base runtime type name for this instance
   */
  toRawType() {
    return stringify(typesToMap(this.registry, this.#Types));
  }

  /**
   * @description Returns the string representation of the value
   */
  toString() {
    return stringify(this.toJSON());
  }

  /**
   * @description Encodes the value as a Uint8Array as per the SCALE specifications
   * @param isBare true when the value has none of the type-specific prefixes (internal)
   */
  toU8a(isBare) {
    const encoded = [];
    for (const [k, v] of this.entries()) {
      if (v && isFunction(v.toU8a)) {
        encoded.push(v.toU8a(!isBare || isBoolean(isBare) ? isBare : isBare[k]));
      }
    }
    return u8aConcatStrict(encoded);
  }
}
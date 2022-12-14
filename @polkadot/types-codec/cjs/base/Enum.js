"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Enum = void 0;
var _util = require("@polkadot/util");
var _utils = require("../utils");
var _Null = require("./Null");
// Copyright 2017-2022 @polkadot/types-codec authors & contributors
// SPDX-License-Identifier: Apache-2.0

function noopSetDefinition(d) {
  return d;
}
function isRustEnum(def) {
  const defValues = Object.values(def);
  if (defValues.some(v => (0, _util.isNumber)(v))) {
    if (!defValues.every(v => (0, _util.isNumber)(v) && v >= 0 && v <= 255)) {
      throw new Error('Invalid number-indexed enum definition');
    }
    return false;
  }
  return true;
}
function extractDef(registry, _def) {
  const def = {};
  let isBasic;
  let isIndexed;
  if (Array.isArray(_def)) {
    for (let i = 0; i < _def.length; i++) {
      def[_def[i]] = {
        Type: _Null.Null,
        index: i
      };
    }
    isBasic = true;
    isIndexed = false;
  } else if (isRustEnum(_def)) {
    const [Types, keys] = (0, _utils.mapToTypeMap)(registry, _def);
    for (let i = 0; i < keys.length; i++) {
      def[keys[i]] = {
        Type: Types[i],
        index: i
      };
    }
    isBasic = !Object.values(def).some(_ref => {
      let {
        Type
      } = _ref;
      return Type !== _Null.Null;
    });
    isIndexed = false;
  } else {
    const entries = Object.entries(_def);
    for (let i = 0; i < entries.length; i++) {
      const [key, index] = entries[i];
      def[key] = {
        Type: _Null.Null,
        index
      };
    }
    isBasic = true;
    isIndexed = true;
  }
  return {
    def,
    isBasic,
    isIndexed
  };
}
function getEntryType(def, checkIdx) {
  const values = Object.values(def);
  for (let i = 0; i < values.length; i++) {
    const {
      Type,
      index
    } = values[i];
    if (index === checkIdx) {
      return Type;
    }
  }
  throw new Error(`Unable to create Enum via index ${checkIdx}, in ${Object.keys(def).join(', ')}`);
}
function createFromU8a(registry, def, index, value) {
  const Type = getEntryType(def, index);
  return {
    index,
    value: new Type(registry, value)
  };
}
function createFromValue(registry, def) {
  let index = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  let value = arguments.length > 3 ? arguments[3] : undefined;
  const Type = getEntryType(def, index);
  return {
    index,
    value: value instanceof Type ? value : new Type(registry, value)
  };
}
function decodeFromJSON(registry, def, key, value) {
  // JSON comes in the form of { "<type (camelCase)>": "<value for type>" }, here we
  // additionally force to lower to ensure forward compat
  const keys = Object.keys(def).map(k => k.toLowerCase());
  const keyLower = key.toLowerCase();
  const index = keys.indexOf(keyLower);
  if (index === -1) {
    throw new Error(`Cannot map Enum JSON, unable to find '${key}' in ${keys.join(', ')}`);
  }
  try {
    return createFromValue(registry, def, Object.values(def)[index].index, value);
  } catch (error) {
    throw new Error(`Enum(${key}):: ${error.message}`);
  }
}
function decodeEnum(registry, def, value, index) {
  // NOTE We check the index path first, before looking at values - this allows treating
  // the optional indexes before anything else, more-specific > less-specific
  if ((0, _util.isNumber)(index)) {
    return createFromValue(registry, def, index, value);
  } else if ((0, _util.isU8a)(value) || (0, _util.isHex)(value)) {
    const u8a = (0, _util.u8aToU8a)(value);

    // nested, we don't want to match isObject below
    if (u8a.length) {
      return createFromU8a(registry, def, u8a[0], u8a.subarray(1));
    }
  } else if (value instanceof Enum) {
    return createFromValue(registry, def, value.index, value.value);
  } else if ((0, _util.isNumber)(value)) {
    return createFromValue(registry, def, value);
  } else if ((0, _util.isString)(value)) {
    return decodeFromJSON(registry, def, value.toString());
  } else if ((0, _util.isObject)(value)) {
    const key = Object.keys(value)[0];
    return decodeFromJSON(registry, def, key, value[key]);
  }

  // Worst-case scenario, return the first with default
  return createFromValue(registry, def, Object.values(def)[0].index);
}

/**
 * @name Enum
 * @description
 * This implements an enum, that based on the value wraps a different type. It is effectively
 * an extension to enum where the value type is determined by the actual index.
 */
class Enum {
  #def;
  #entryIndex;
  #indexes;
  #isBasic;
  #isIndexed;
  #raw;
  constructor(registry, Types, value, index) {
    let {
      definition,
      setDefinition = noopSetDefinition
    } = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
    const {
      def,
      isBasic,
      isIndexed
    } = definition || setDefinition(extractDef(registry, Types));

    // shortcut isU8a as used in SCALE decoding
    const decoded = (0, _util.isU8a)(value) && value.length && !(0, _util.isNumber)(index) ? createFromU8a(registry, def, value[0], value.subarray(1)) : decodeEnum(registry, def, value, index);
    this.registry = registry;
    this.#def = def;
    this.#isBasic = isBasic;
    this.#isIndexed = isIndexed;
    this.#indexes = Object.values(def).map(_ref2 => {
      let {
        index
      } = _ref2;
      return index;
    });
    this.#entryIndex = this.#indexes.indexOf(decoded.index);
    this.#raw = decoded.value;
    if (this.#raw.initialU8aLength) {
      this.initialU8aLength = 1 + this.#raw.initialU8aLength;
    }
  }
  static with(Types) {
    var _class;
    let definition;

    // eslint-disable-next-line no-return-assign
    const setDefinition = d => definition = d;
    return _class = class extends Enum {
      constructor(registry, value, index) {
        super(registry, Types, value, index, {
          definition,
          setDefinition
        });
      }
    }, (() => {
      const keys = Array.isArray(Types) ? Types : Object.keys(Types);
      const asKeys = new Array(keys.length);
      const isKeys = new Array(keys.length);
      for (let i = 0; i < keys.length; i++) {
        const name = (0, _util.stringPascalCase)(keys[i]);
        asKeys[i] = `as${name}`;
        isKeys[i] = `is${name}`;
      }
      (0, _util.objectProperties)(_class.prototype, isKeys, (_, i, self) => self.type === keys[i]);
      (0, _util.objectProperties)(_class.prototype, asKeys, (k, i, self) => {
        if (self.type !== keys[i]) {
          throw new Error(`Cannot convert '${self.type}' via ${k}`);
        }
        return self.value;
      });
    })(), _class;
  }

  /**
   * @description The length of the value when encoded as a Uint8Array
   */
  get encodedLength() {
    return 1 + this.#raw.encodedLength;
  }

  /**
   * @description returns a hash of the contents
   */
  get hash() {
    return this.registry.hash(this.toU8a());
  }

  /**
   * @description The index of the enum value
   */
  get index() {
    return this.#indexes[this.#entryIndex];
  }

  /**
   * @description The value of the enum
   */
  get inner() {
    return this.#raw;
  }

  /**
   * @description true if this is a basic enum (no values)
   */
  get isBasic() {
    return this.#isBasic;
  }

  /**
   * @description Checks if the value is an empty value
   */
  get isEmpty() {
    return this.#raw.isEmpty;
  }

  /**
   * @description Checks if the Enum points to a [[Null]] type
   */
  get isNone() {
    return this.#raw instanceof _Null.Null;
  }

  /**
   * @description The available keys for this enum
   */
  get defIndexes() {
    return this.#indexes;
  }

  /**
   * @description The available keys for this enum
   */
  get defKeys() {
    return Object.keys(this.#def);
  }

  /**
   * @description The name of the type this enum value represents
   */
  get type() {
    return this.defKeys[this.#entryIndex];
  }

  /**
   * @description The value of the enum
   */
  get value() {
    return this.#raw;
  }

  /**
   * @description Compares the value of the input to see if there is a match
   */
  eq(other) {
    // cater for the case where we only pass the enum index
    if ((0, _util.isU8a)(other)) {
      return !this.toU8a().some((entry, index) => entry !== other[index]);
    } else if ((0, _util.isNumber)(other)) {
      return this.toNumber() === other;
    } else if (this.#isBasic && (0, _util.isString)(other)) {
      return this.type === other;
    } else if ((0, _util.isHex)(other)) {
      return this.toHex() === other;
    } else if (other instanceof Enum) {
      return this.index === other.index && this.value.eq(other.value);
    } else if ((0, _util.isObject)(other)) {
      return this.value.eq(other[this.type]);
    }

    // compare the actual wrapper value
    return this.value.eq(other);
  }

  /**
   * @description Returns a breakdown of the hex encoding for this Codec
   */
  inspect() {
    if (this.#isBasic) {
      return {
        outer: [new Uint8Array([this.index])]
      };
    }
    const {
      inner,
      outer = []
    } = this.#raw.inspect();
    return {
      inner,
      outer: [new Uint8Array([this.index]), ...outer]
    };
  }

  /**
   * @description Returns a hex string representation of the value
   */
  toHex() {
    return (0, _util.u8aToHex)(this.toU8a());
  }

  /**
   * @description Converts the Object to to a human-friendly JSON, with additional fields, expansion and formatting of information
   */
  toHuman(isExtended) {
    return this.#isBasic || this.isNone ? this.type : {
      [this.type]: this.#raw.toHuman(isExtended)
    };
  }

  /**
   * @description Converts the Object to JSON, typically used for RPC transfers
   */
  toJSON() {
    return this.#isBasic ? this.type : {
      [(0, _util.stringCamelCase)(this.type)]: this.#raw.toJSON()
    };
  }

  /**
   * @description Returns the number representation for the value
   */
  toNumber() {
    return this.index;
  }

  /**
   * @description Converts the value in a best-fit primitive form
   */
  toPrimitive() {
    return this.#isBasic ? this.type : {
      [(0, _util.stringCamelCase)(this.type)]: this.#raw.toPrimitive()
    };
  }

  /**
   * @description Returns a raw struct representation of the enum types
   */
  _toRawStruct() {
    if (this.#isBasic) {
      return this.#isIndexed ? this.defKeys.reduce((out, key, index) => {
        out[key] = this.#indexes[index];
        return out;
      }, {}) : this.defKeys;
    }
    const entries = Object.entries(this.#def);
    return (0, _utils.typesToMap)(this.registry, entries.reduce((out, _ref3, i) => {
      let [key, {
        Type
      }] = _ref3;
      out[0][i] = Type;
      out[1][i] = key;
      return out;
    }, [new Array(entries.length), new Array(entries.length)]));
  }

  /**
   * @description Returns the base runtime type name for this instance
   */
  toRawType() {
    return (0, _util.stringify)({
      _enum: this._toRawStruct()
    });
  }

  /**
   * @description Returns the string representation of the value
   */
  toString() {
    return this.isNone ? this.type : (0, _util.stringify)(this.toJSON());
  }

  /**
   * @description Encodes the value as a Uint8Array as per the SCALE specifications
   * @param isBare true when the value has none of the type-specific prefixes (internal)
   */
  toU8a(isBare) {
    return isBare ? this.#raw.toU8a(isBare) : (0, _util.u8aConcatStrict)([new Uint8Array([this.index]), this.#raw.toU8a(isBare)]);
  }
}
exports.Enum = Enum;
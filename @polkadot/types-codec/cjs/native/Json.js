"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Json = void 0;
var _util = require("@polkadot/util");
var _utils = require("../utils");
// Copyright 2017-2022 @polkadot/types-codec authors & contributors
// SPDX-License-Identifier: Apache-2.0

/** @internal */
function decodeJson(value) {
  return Object.entries(value || {});
}

/**
 * @name Json
 * @description
 * Wraps the a JSON structure retrieve via RPC. It extends the standard JS Map with. While it
 * implements a Codec, it is limited in that it can only be used with input objects via RPC,
 * i.e. no hex decoding. Unlike a struct, this waps a JSON object with unknown keys
 * @noInheritDoc
 */
class Json extends Map {
  constructor(registry, value) {
    const decoded = decodeJson(value);
    super(decoded);
    this.registry = registry;
    (0, _util.objectProperties)(this, decoded.map(_ref => {
      let [k] = _ref;
      return k;
    }), k => this.get(k));
  }

  /**
   * @description Always 0, never encodes as a Uint8Array
   */
  get encodedLength() {
    return 0;
  }

  /**
   * @description returns a hash of the contents
   */
  get hash() {
    return this.registry.hash(this.toU8a());
  }

  /**
   * @description Checks if the value is an empty value
   */
  get isEmpty() {
    return [...this.keys()].length === 0;
  }

  /**
   * @description Compares the value of the input to see if there is a match
   */
  eq(other) {
    return (0, _utils.compareMap)(this, other);
  }

  /**
   * @description Returns a typed value from the internal map
   */
  getT(key) {
    return this.get(key);
  }

  /**
   * @description Unimplemented, will throw
   */
  inspect() {
    throw new Error('Unimplemented');
  }

  /**
   * @description Unimplemented, will throw
   */
  toHex() {
    throw new Error('Unimplemented');
  }

  /**
   * @description Converts the Object to to a human-friendly JSON, with additional fields, expansion and formatting of information
   */
  toHuman() {
    return [...this.entries()].reduce((json, _ref2) => {
      let [key, value] = _ref2;
      json[key] = (0, _util.isFunction)(value.toHuman) ? value.toHuman() : value;
      return json;
    }, {});
  }

  /**
   * @description Converts the Object to JSON, typically used for RPC transfers
   */
  toJSON() {
    return [...this.entries()].reduce((json, _ref3) => {
      let [key, value] = _ref3;
      json[key] = value;
      return json;
    }, {});
  }

  /**
   * @description Converts the value in a best-fit primitive form
   */
  toPrimitive() {
    return [...this.entries()].reduce((json, _ref4) => {
      let [key, value] = _ref4;
      json[key] = (0, _util.isFunction)(value.toHuman) ? value.toPrimitive() : value;
      return json;
    }, {});
  }

  /**
   * @description Returns the base runtime type name for this instance
   */
  toRawType() {
    return 'Json';
  }

  /**
   * @description Returns the string representation of the value
   */
  toString() {
    return (0, _util.stringify)(this.toJSON());
  }

  /**
   * @description Unimplemented, will throw
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  toU8a(isBare) {
    throw new Error('Unimplemented');
  }
}
exports.Json = Json;
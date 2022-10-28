"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GenericCallIndex = exports.GenericCall = void 0;

var _typesCodec = require("@polkadot/types-codec");

var _util = require("@polkadot/util");

// Copyright 2017-2022 @polkadot/types authors & contributors
// SPDX-License-Identifier: Apache-2.0

/**
 * Get a mapping of `argument name -> argument type` for the function, from
 * its metadata.
 *
 * @param meta - The function metadata used to get the definition.
 * @internal
 */
function getArgsDef(registry, meta) {
  return meta.fields.reduce((result, _ref, index) => {
    let {
      name,
      type
    } = _ref;
    result[name.unwrapOr(`param${index}`).toString()] = registry.createLookupType(type);
    return result;
  }, {});
}
/** @internal */


function decodeCallViaObject(registry, value, _meta) {
  // we only pass args/methodsIndex out
  const {
    args,
    callIndex
  } = value; // Get the correct lookupIndex
  // eslint-disable-next-line @typescript-eslint/no-use-before-define

  const lookupIndex = callIndex instanceof GenericCallIndex ? callIndex.toU8a() : callIndex; // Find metadata with callIndex

  const meta = _meta || registry.findMetaCall(lookupIndex).meta;

  return {
    args,
    argsDef: getArgsDef(registry, meta),
    callIndex,
    meta
  };
}
/** @internal */


function decodeCallViaU8a(registry, value, _meta) {
  // We need 2 bytes for the callIndex
  const callIndex = registry.firstCallIndex.slice();
  callIndex.set(value.subarray(0, 2), 0); // Find metadata with callIndex

  const meta = _meta || registry.findMetaCall(callIndex).meta;

  return {
    args: value.subarray(2),
    argsDef: getArgsDef(registry, meta),
    callIndex,
    meta
  };
}
/**
 * Decode input to pass into constructor.
 *
 * @param value - Value to decode, one of:
 * - hex
 * - Uint8Array
 * - {@see DecodeMethodInput}
 * @param _meta - Metadata to use, so that `injectMethods` lookup is not
 * necessary.
 * @internal
 */


function decodeCall(registry) {
  let value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Uint8Array();

  let _meta = arguments.length > 2 ? arguments[2] : undefined;

  if ((0, _util.isU8a)(value) || (0, _util.isHex)(value)) {
    return decodeCallViaU8a(registry, (0, _util.u8aToU8a)(value), _meta);
  } else if ((0, _util.isObject)(value) && value.callIndex && value.args) {
    return decodeCallViaObject(registry, value, _meta);
  }

  throw new Error(`Call: Cannot decode value '${value}' of type ${typeof value}`);
}
/**
 * @name GenericCallIndex
 * @description
 * A wrapper around the `[sectionIndex, methodIndex]` value that uniquely identifies a method
 */


class GenericCallIndex extends _typesCodec.U8aFixed {
  constructor(registry, value) {
    super(registry, value, 16);
  }
  /**
   * @description Converts the value in a best-fit primitive form
   */


  toPrimitive() {
    return this.toHex();
  }

}
/**
 * @name GenericCall
 * @description
 * Extrinsic function descriptor
 */


exports.GenericCallIndex = GenericCallIndex;

class GenericCall extends _typesCodec.Struct {
  constructor(registry, value, meta) {
    const decoded = decodeCall(registry, value, meta);

    try {
      super(registry, {
        callIndex: GenericCallIndex,
        // eslint-disable-next-line sort-keys
        args: _typesCodec.Struct.with(decoded.argsDef)
      }, decoded);
    } catch (error) {
      let method = 'unknown.unknown';

      try {
        const c = registry.findMetaCall(decoded.callIndex);
        method = `${c.section}.${c.method}`;
      } catch (error) {// ignore
      }

      throw new Error(`Call: failed decoding ${method}:: ${error.message}`);
    }

    this._meta = decoded.meta;
  }
  /**
   * @description The arguments for the function call
   */


  get args() {
    return [...this.getT('args').values()];
  }
  /**
   * @description The argument definitions
   */


  get argsDef() {
    return getArgsDef(this.registry, this.meta);
  }
  /**
   * @description The argument entries
   */


  get argsEntries() {
    return [...this.getT('args').entries()];
  }
  /**
   * @description The encoded `[sectionIndex, methodIndex]` identifier
   */


  get callIndex() {
    return this.getT('callIndex').toU8a();
  }
  /**
   * @description The encoded data
   */


  get data() {
    return this.getT('args').toU8a();
  }
  /**
   * @description The [[FunctionMetadata]]
   */


  get meta() {
    return this._meta;
  }
  /**
   * @description Returns the name of the method
   */


  get method() {
    return this.registry.findMetaCall(this.callIndex).method;
  }
  /**
   * @description Returns the module containing the method
   */


  get section() {
    return this.registry.findMetaCall(this.callIndex).section;
  }
  /**
   * @description Checks if the source matches this in type
   */


  is(other) {
    return other.callIndex[0] === this.callIndex[0] && other.callIndex[1] === this.callIndex[1];
  }
  /**
   * @description Converts the Object to to a human-friendly JSON, with additional fields, expansion and formatting of information
   */


  toHuman(isExpanded) {
    var _call, _call2;

    let call;

    try {
      call = this.registry.findMetaCall(this.callIndex);
    } catch (error) {// swallow
    }

    return (0, _util.objectSpread)({
      args: this.argsEntries.reduce((args, _ref2) => {
        let [n, a] = _ref2;
        return (0, _util.objectSpread)(args, {
          [n]: a.toHuman(isExpanded)
        });
      }, {}),
      method: (_call = call) === null || _call === void 0 ? void 0 : _call.method,
      section: (_call2 = call) === null || _call2 === void 0 ? void 0 : _call2.section
    }, isExpanded && call ? {
      docs: call.meta.docs.map(d => d.toString())
    } : null);
  }
  /**
   * @description Returns the base runtime type name for this instance
   */


  toRawType() {
    return 'Call';
  }

}

exports.GenericCall = GenericCall;
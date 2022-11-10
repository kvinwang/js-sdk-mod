"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GenericEventData = exports.GenericEvent = void 0;
var _typesCodec = require("@polkadot/types-codec");
var _util = require("@polkadot/util");
// Copyright 2017-2022 @polkadot/types authors & contributors
// SPDX-License-Identifier: Apache-2.0

/** @internal */
function decodeEvent(registry, value) {
  if (!value || !value.length) {
    return {
      DataType: _typesCodec.Null
    };
  }
  const index = value.subarray(0, 2);
  return {
    DataType: registry.findMetaEvent(index),
    value: {
      data: value.subarray(2),
      index
    }
  };
}

/**
 * @name GenericEventData
 * @description
 * Wrapper for the actual data that forms part of an [[Event]]
 */
class GenericEventData extends _typesCodec.Tuple {
  #meta;
  #method;
  #names = null;
  #section;
  #typeDef;
  constructor(registry, value, meta) {
    let section = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '<unknown>';
    let method = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : '<unknown>';
    const fields = (meta == null ? void 0 : meta.fields) || [];
    super(registry, fields.map(_ref => {
      let {
        type
      } = _ref;
      return registry.createLookupType(type);
    }), value);
    this.#meta = meta;
    this.#method = method;
    this.#section = section;
    this.#typeDef = fields.map(_ref2 => {
      let {
        type
      } = _ref2;
      return registry.lookup.getTypeDef(type);
    });
    const names = fields.map(_ref3 => {
      let {
        name
      } = _ref3;
      return registry.lookup.sanitizeField(name)[0];
    }).filter(n => !!n);
    if (names.length === fields.length) {
      this.#names = names;
      (0, _util.objectProperties)(this, names, (_, i) => this[i]);
    }
  }

  /**
   * @description The wrapped [[EventMetadata]]
   */
  get meta() {
    return this.#meta;
  }

  /**
   * @description The method as a string
   */
  get method() {
    return this.#method;
  }

  /**
   * @description The field names (as available)
   */
  get names() {
    return this.#names;
  }

  /**
   * @description The section as a string
   */
  get section() {
    return this.#section;
  }

  /**
   * @description The [[TypeDef]] for this event
   */
  get typeDef() {
    return this.#typeDef;
  }

  /**
   * @description Converts the Object to to a human-friendly JSON, with additional fields, expansion and formatting of information
   */
  toHuman(isExtended) {
    if (this.#names !== null) {
      const json = {};
      for (let i = 0; i < this.#names.length; i++) {
        json[this.#names[i]] = this[i].toHuman(isExtended);
      }
      return json;
    }
    return super.toHuman(isExtended);
  }
}

/**
 * @name GenericEvent
 * @description
 * A representation of a system event. These are generated via the [[Metadata]] interfaces and
 * specific to a specific Substrate runtime
 */
exports.GenericEventData = GenericEventData;
class GenericEvent extends _typesCodec.Struct {
  // Currently we _only_ decode from Uint8Array, since we expect it to
  // be used via EventRecord
  constructor(registry, _value) {
    const {
      DataType,
      value
    } = decodeEvent(registry, _value);
    super(registry, {
      index: 'EventId',
      // eslint-disable-next-line sort-keys
      data: DataType
    }, value);
  }

  /**
   * @description The wrapped [[EventData]]
   */
  get data() {
    return this.getT('data');
  }

  /**
   * @description The [[EventId]], identifying the raw event
   */
  get index() {
    return this.getT('index');
  }

  /**
   * @description The [[EventMetadata]] with the documentation
   */
  get meta() {
    return this.data.meta;
  }

  /**
   * @description The method string identifying the event
   */
  get method() {
    return this.data.method;
  }

  /**
   * @description The section string identifying the event
   */
  get section() {
    return this.data.section;
  }

  /**
   * @description The [[TypeDef]] for the event
   */
  get typeDef() {
    return this.data.typeDef;
  }

  /**
   * @description Converts the Object to to a human-friendly JSON, with additional fields, expansion and formatting of information
   */
  toHuman(isExpanded) {
    return (0, _util.objectSpread)({
      method: this.method,
      section: this.section
    }, isExpanded ? {
      docs: this.meta.docs.map(d => d.toString())
    } : null, super.toHuman(isExpanded));
  }
}
exports.GenericEvent = GenericEvent;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUniqTypes = getUniqTypes;
var _flattenUniq = require("./flattenUniq");
var _validateTypes = require("./validateTypes");
// Copyright 2017-2022 @polkadot/types authors & contributors
// SPDX-License-Identifier: Apache-2.0

/** @internal */
function extractTypes(lookup, types) {
  return types.map(_ref => {
    let {
      type
    } = _ref;
    return lookup.getTypeDef(type).type;
  });
}

/** @internal */
function extractFieldTypes(lookup, type) {
  return lookup.getSiType(type).def.asVariant.variants.map(_ref2 => {
    let {
      fields
    } = _ref2;
    return extractTypes(lookup, fields);
  });
}

/** @internal */
function getPalletNames(_ref3) {
  let {
    lookup,
    pallets
  } = _ref3;
  return pallets.reduce((all, _ref4) => {
    let {
      calls,
      constants,
      events,
      storage
    } = _ref4;
    all.push([extractTypes(lookup, constants)]);
    if (calls.isSome) {
      all.push(extractFieldTypes(lookup, calls.unwrap().type));
    }
    if (events.isSome) {
      all.push(extractFieldTypes(lookup, events.unwrap().type));
    }
    if (storage.isSome) {
      all.push(storage.unwrap().items.map(_ref5 => {
        let {
          type
        } = _ref5;
        if (type.isPlain) {
          return [lookup.getTypeDef(type.asPlain).type];
        }
        const {
          hashers,
          key,
          value
        } = type.asMap;
        return hashers.length === 1 ? [lookup.getTypeDef(value).type, lookup.getTypeDef(key).type] : [lookup.getTypeDef(value).type, ...lookup.getSiType(key).def.asTuple.map(t => lookup.getTypeDef(t).type)];
      }));
    }
    return all;
  }, []);
}

/** @internal */
function getUniqTypes(registry, meta, throwError) {
  return (0, _validateTypes.validateTypes)(registry, throwError, (0, _flattenUniq.flattenUniq)(getPalletNames(meta)));
}
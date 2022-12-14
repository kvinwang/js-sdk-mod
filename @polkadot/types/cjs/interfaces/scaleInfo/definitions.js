"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _util = require("@polkadot/util");
var _v = require("./v0");
var _v2 = require("./v1");
// Copyright 2017-2022 @polkadot/types authors & contributors
// SPDX-License-Identifier: Apache-2.0
// order important in structs... :)
/* eslint-disable sort-keys */
var _default = {
  rpc: {},
  types: (0, _util.objectSpread)({}, _v.v0, _v2.v1, {
    // latest mappings
    SiField: 'Si1Field',
    SiLookupTypeId: 'Si1LookupTypeId',
    SiPath: 'Si1Path',
    SiType: 'Si1Type',
    SiTypeDef: 'Si1TypeDef',
    SiTypeDefArray: 'Si1TypeDefArray',
    SiTypeDefBitSequence: 'Si1TypeDefBitSequence',
    SiTypeDefCompact: 'Si1TypeDefCompact',
    SiTypeDefComposite: 'Si1TypeDefComposite',
    SiTypeDefPrimitive: 'Si1TypeDefPrimitive',
    SiTypeDefSequence: 'Si1TypeDefSequence',
    SiTypeDefTuple: 'Si1TypeDefTuple',
    SiTypeParameter: 'Si1TypeParameter',
    SiTypeDefVariant: 'Si1TypeDefVariant',
    SiVariant: 'Si1Variant'
  })
};
exports.default = _default;
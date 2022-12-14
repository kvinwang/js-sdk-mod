"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.decorateStorage = decorateStorage;
var _util = require("@polkadot/util");
var _util2 = require("../util");
var _createFunction = require("./createFunction");
var _getStorage = require("./getStorage");
var _util3 = require("./util");
// Copyright 2017-2022 @polkadot/types authors & contributors
// SPDX-License-Identifier: Apache-2.0

const VERSION_NAME = 'palletVersion';
const VERSION_KEY = ':__STORAGE_VERSION__:';
const VERSION_DOCS = {
  docs: 'Returns the current pallet version from storage',
  type: 'u16'
};

/** @internal */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function decorateStorage(registry, _ref, _metaVersion) {
  let {
    pallets
  } = _ref;
  const result = (0, _getStorage.getStorage)(registry);
  for (let i = 0; i < pallets.length; i++) {
    const {
      name,
      storage
    } = pallets[i];
    if (storage.isSome) {
      const section = (0, _util.stringCamelCase)(name);
      const {
        items,
        prefix: _prefix
      } = storage.unwrap();
      const prefix = _prefix.toString();
      (0, _util.lazyMethod)(result, section, () => (0, _util.lazyMethods)({
        palletVersion: (0, _util3.createRuntimeFunction)({
          method: VERSION_NAME,
          prefix,
          section
        }, (0, _createFunction.createKeyRaw)(registry, {
          method: VERSION_KEY,
          prefix: name.toString()
        }, _createFunction.NO_RAW_ARGS), VERSION_DOCS)(registry)
      }, items, meta => (0, _createFunction.createFunction)(registry, {
        meta,
        method: meta.name.toString(),
        prefix,
        section
      }, {}), _util2.objectNameToCamel));
    }
  }
  return result;
}
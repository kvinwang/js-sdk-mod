"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "decorateConstants", {
  enumerable: true,
  get: function () {
    return _constants.decorateConstants;
  }
});
Object.defineProperty(exports, "decorateErrors", {
  enumerable: true,
  get: function () {
    return _errors.decorateErrors;
  }
});
Object.defineProperty(exports, "decorateEvents", {
  enumerable: true,
  get: function () {
    return _events.decorateEvents;
  }
});
Object.defineProperty(exports, "decorateExtrinsics", {
  enumerable: true,
  get: function () {
    return _extrinsics.decorateExtrinsics;
  }
});
Object.defineProperty(exports, "decorateStorage", {
  enumerable: true,
  get: function () {
    return _storage.decorateStorage;
  }
});
exports.expandMetadata = expandMetadata;
Object.defineProperty(exports, "filterCallsSome", {
  enumerable: true,
  get: function () {
    return _extrinsics.filterCallsSome;
  }
});
Object.defineProperty(exports, "filterEventsSome", {
  enumerable: true,
  get: function () {
    return _events.filterEventsSome;
  }
});
var _Metadata = require("../Metadata");
var _constants = require("./constants");
var _errors = require("./errors");
var _events = require("./events");
var _extrinsics = require("./extrinsics");
var _storage = require("./storage");
// Copyright 2017-2022 @polkadot/types authors & contributors
// SPDX-License-Identifier: Apache-2.0

/**
 * Expands the metadata by decoration into consts, query and tx sections
 */
function expandMetadata(registry, metadata) {
  if (!(metadata instanceof _Metadata.Metadata)) {
    throw new Error('You need to pass a valid Metadata instance to Decorated');
  }
  const latest = metadata.asLatest;
  const version = metadata.version;
  return {
    consts: (0, _constants.decorateConstants)(registry, latest, version),
    errors: (0, _errors.decorateErrors)(registry, latest, version),
    events: (0, _events.decorateEvents)(registry, latest, version),
    query: (0, _storage.decorateStorage)(registry, latest, version),
    registry,
    tx: (0, _extrinsics.decorateExtrinsics)(registry, latest, version)
  };
}
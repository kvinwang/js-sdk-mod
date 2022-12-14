"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  ApiBase: true
};
Object.defineProperty(exports, "ApiBase", {
  enumerable: true,
  get: function () {
    return _base.ApiBase;
  }
});
var _types = require("@polkadot/api-base/types");
Object.keys(_types).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _types[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _types[key];
    }
  });
});
var _calls = require("@polkadot/api/types/calls");
Object.keys(_calls).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _calls[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _calls[key];
    }
  });
});
var _consts = require("@polkadot/api/types/consts");
Object.keys(_consts).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _consts[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _consts[key];
    }
  });
});
var _errors = require("@polkadot/api/types/errors");
Object.keys(_errors).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _errors[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _errors[key];
    }
  });
});
var _events = require("@polkadot/api/types/events");
Object.keys(_events).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _events[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _events[key];
    }
  });
});
var _storage = require("@polkadot/api/types/storage");
Object.keys(_storage).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _storage[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _storage[key];
    }
  });
});
var _submittable = require("@polkadot/api/types/submittable");
Object.keys(_submittable).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _submittable[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _submittable[key];
    }
  });
});
var _base = require("../base");
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _calls = require("@polkadot/api-base/types/calls");
Object.keys(_calls).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _calls[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _calls[key];
    }
  });
});
var _consts = require("@polkadot/api-base/types/consts");
Object.keys(_consts).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _consts[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _consts[key];
    }
  });
});
var _errors = require("@polkadot/api-base/types/errors");
Object.keys(_errors).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _errors[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _errors[key];
    }
  });
});
var _events = require("@polkadot/api-base/types/events");
Object.keys(_events).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _events[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _events[key];
    }
  });
});
var _storage = require("@polkadot/api-base/types/storage");
Object.keys(_storage).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _storage[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _storage[key];
    }
  });
});
var _submittable = require("@polkadot/api-base/types/submittable");
Object.keys(_submittable).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _submittable[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _submittable[key];
    }
  });
});
var _api = require("./api");
Object.keys(_api).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _api[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _api[key];
    }
  });
});
var _base = require("./base");
Object.keys(_base).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _base[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _base[key];
    }
  });
});
var _derive = require("./derive");
Object.keys(_derive).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _derive[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _derive[key];
    }
  });
});
var _rpc = require("./rpc");
Object.keys(_rpc).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _rpc[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _rpc[key];
    }
  });
});
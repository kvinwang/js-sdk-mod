"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
require("./augmentLookup");
require("./augmentRegistry");
var _registry = require("@polkadot/types/types/registry");
Object.keys(_registry).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _registry[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _registry[key];
    }
  });
});
var _types = require("../create/types");
Object.keys(_types).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _types[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _types[key];
    }
  });
});
var _calls = require("./calls");
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
var _codec = require("./codec");
Object.keys(_codec).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _codec[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _codec[key];
    }
  });
});
var _definitions = require("./definitions");
Object.keys(_definitions).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _definitions[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _definitions[key];
    }
  });
});
var _detect = require("./detect");
Object.keys(_detect).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _detect[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _detect[key];
    }
  });
});
var _events = require("./events");
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
var _extrinsic = require("./extrinsic");
Object.keys(_extrinsic).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _extrinsic[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _extrinsic[key];
    }
  });
});
var _interfaces = require("./interfaces");
Object.keys(_interfaces).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _interfaces[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _interfaces[key];
    }
  });
});
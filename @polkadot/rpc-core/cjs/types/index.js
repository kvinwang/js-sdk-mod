"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _jsonrpc = require("@polkadot/rpc-core/types/jsonrpc");
Object.keys(_jsonrpc).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _jsonrpc[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _jsonrpc[key];
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
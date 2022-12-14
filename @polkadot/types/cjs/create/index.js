"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _typesCreate = require("@polkadot/types-create");
Object.keys(_typesCreate).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _typesCreate[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _typesCreate[key];
    }
  });
});
var _createClass = require("./createClass");
Object.keys(_createClass).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _createClass[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _createClass[key];
    }
  });
});
var _createType = require("./createType");
Object.keys(_createType).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _createType[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _createType[key];
    }
  });
});
var _lazy = require("./lazy");
Object.keys(_lazy).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _lazy[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _lazy[key];
    }
  });
});
var _registry = require("./registry");
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
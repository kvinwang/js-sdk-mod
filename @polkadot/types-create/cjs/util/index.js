"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _encodeTypes = require("./encodeTypes");
Object.keys(_encodeTypes).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _encodeTypes[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _encodeTypes[key];
    }
  });
});
var _getTypeDef = require("./getTypeDef");
Object.keys(_getTypeDef).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _getTypeDef[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _getTypeDef[key];
    }
  });
});
var _typeSplit = require("./typeSplit");
Object.keys(_typeSplit).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _typeSplit[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _typeSplit[key];
    }
  });
});
var _xcm = require("./xcm");
Object.keys(_xcm).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _xcm[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _xcm[key];
    }
  });
});
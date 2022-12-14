"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  mapXcmTypes: true,
  packageInfo: true
};
Object.defineProperty(exports, "mapXcmTypes", {
  enumerable: true,
  get: function () {
    return _typesCreate.mapXcmTypes;
  }
});
Object.defineProperty(exports, "packageInfo", {
  enumerable: true,
  get: function () {
    return _packageInfo.packageInfo;
  }
});
var _typesCreate = require("@polkadot/types-create");
var _packageInfo = require("./packageInfo");
var _util = require("./util");
Object.keys(_util).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _util[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _util[key];
    }
  });
});
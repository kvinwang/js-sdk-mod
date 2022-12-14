"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  Keyring: true,
  HttpProvider: true,
  ScProvider: true,
  WsProvider: true,
  packageInfo: true,
  SubmittableResult: true
};
Object.defineProperty(exports, "HttpProvider", {
  enumerable: true,
  get: function () {
    return _rpcProvider.HttpProvider;
  }
});
Object.defineProperty(exports, "Keyring", {
  enumerable: true,
  get: function () {
    return _keyring.Keyring;
  }
});
Object.defineProperty(exports, "ScProvider", {
  enumerable: true,
  get: function () {
    return _rpcProvider.ScProvider;
  }
});
Object.defineProperty(exports, "SubmittableResult", {
  enumerable: true,
  get: function () {
    return _submittable.SubmittableResult;
  }
});
Object.defineProperty(exports, "WsProvider", {
  enumerable: true,
  get: function () {
    return _rpcProvider.WsProvider;
  }
});
Object.defineProperty(exports, "packageInfo", {
  enumerable: true,
  get: function () {
    return _packageInfo.packageInfo;
  }
});
require("@polkadot/rpc-augment");
var _keyring = require("@polkadot/keyring");
var _rpcProvider = require("@polkadot/rpc-provider");
var _packageInfo = require("./packageInfo");
var _submittable = require("./submittable");
var _promise = require("./promise");
Object.keys(_promise).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _promise[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _promise[key];
    }
  });
});
var _rx = require("./rx");
Object.keys(_rx).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _rx[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _rx[key];
    }
  });
});
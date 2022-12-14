"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _childKey = require("./childKey");
Object.keys(_childKey).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _childKey[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _childKey[key];
    }
  });
});
var _contributions = require("./contributions");
Object.keys(_contributions).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _contributions[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _contributions[key];
    }
  });
});
var _ownContributions = require("./ownContributions");
Object.keys(_ownContributions).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _ownContributions[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _ownContributions[key];
    }
  });
});
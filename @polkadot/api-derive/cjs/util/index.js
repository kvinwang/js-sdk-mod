"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  drr: true,
  memo: true
};
Object.defineProperty(exports, "drr", {
  enumerable: true,
  get: function () {
    return _rpcCore.drr;
  }
});
Object.defineProperty(exports, "memo", {
  enumerable: true,
  get: function () {
    return _rpcCore.memo;
  }
});
var _rpcCore = require("@polkadot/rpc-core");
var _approvalFlagsToBools = require("./approvalFlagsToBools");
Object.keys(_approvalFlagsToBools).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _approvalFlagsToBools[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _approvalFlagsToBools[key];
    }
  });
});
var _blockNumber = require("./blockNumber");
Object.keys(_blockNumber).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _blockNumber[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _blockNumber[key];
    }
  });
});
var _cache = require("./cache");
Object.keys(_cache).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _cache[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _cache[key];
    }
  });
});
var _cacheImpl = require("./cacheImpl");
Object.keys(_cacheImpl).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _cacheImpl[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _cacheImpl[key];
    }
  });
});
var _first = require("./first");
Object.keys(_first).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _first[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _first[key];
    }
  });
});
var _lazy = require("./lazy");
Object.keys(_lazy).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _lazy[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _lazy[key];
    }
  });
});
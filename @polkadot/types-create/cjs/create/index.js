"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _class = require("./class");
Object.keys(_class).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _class[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _class[key];
    }
  });
});
var _type = require("./type");
Object.keys(_type).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _type[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _type[key];
    }
  });
});
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LRUCache = void 0;
var _classPrivateFieldLooseBase2 = _interopRequireDefault(require("@babel/runtime/helpers/classPrivateFieldLooseBase"));
var _classPrivateFieldLooseKey2 = _interopRequireDefault(require("@babel/runtime/helpers/classPrivateFieldLooseKey"));
// Copyright 2017-2022 @polkadot/rpc-provider authors & contributors
// SPDX-License-Identifier: Apache-2.0

// Assuming all 1.5MB responses, we apply a default allowing for 192MB
// cache space (depending on the historic queries this would vary, metadata
// for Kusama/Polkadot/Substrate falls between 600-750K, 2x for estimate)
const DEFAULT_CAPACITY = 128;
class LRUNode {
  constructor(key) {
    this.key = key;
    this.next = this.prev = this;
  }
}

// https://en.wikipedia.org/wiki/Cache_replacement_policies#LRU
var _data = /*#__PURE__*/(0, _classPrivateFieldLooseKey2.default)("data");
var _refs = /*#__PURE__*/(0, _classPrivateFieldLooseKey2.default)("refs");
var _length = /*#__PURE__*/(0, _classPrivateFieldLooseKey2.default)("length");
var _head = /*#__PURE__*/(0, _classPrivateFieldLooseKey2.default)("head");
var _tail = /*#__PURE__*/(0, _classPrivateFieldLooseKey2.default)("tail");
var _toHead = /*#__PURE__*/(0, _classPrivateFieldLooseKey2.default)("toHead");
class LRUCache {
  constructor() {
    let capacity = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : DEFAULT_CAPACITY;
    Object.defineProperty(this, _toHead, {
      value: _toHead2
    });
    this.capacity = void 0;
    Object.defineProperty(this, _data, {
      writable: true,
      value: new Map()
    });
    Object.defineProperty(this, _refs, {
      writable: true,
      value: new Map()
    });
    Object.defineProperty(this, _length, {
      writable: true,
      value: 0
    });
    Object.defineProperty(this, _head, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _tail, {
      writable: true,
      value: void 0
    });
    this.capacity = capacity;
    (0, _classPrivateFieldLooseBase2.default)(this, _head)[_head] = (0, _classPrivateFieldLooseBase2.default)(this, _tail)[_tail] = new LRUNode('<empty>');
  }
  get length() {
    return (0, _classPrivateFieldLooseBase2.default)(this, _length)[_length];
  }
  get lengthData() {
    return (0, _classPrivateFieldLooseBase2.default)(this, _data)[_data].size;
  }
  get lengthRefs() {
    return (0, _classPrivateFieldLooseBase2.default)(this, _refs)[_refs].size;
  }
  entries() {
    const keys = this.keys();
    const entries = new Array(keys.length);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      entries[i] = [key, (0, _classPrivateFieldLooseBase2.default)(this, _data)[_data].get(key)];
    }
    return entries;
  }
  keys() {
    const keys = [];
    if ((0, _classPrivateFieldLooseBase2.default)(this, _length)[_length]) {
      let curr = (0, _classPrivateFieldLooseBase2.default)(this, _head)[_head];
      while (curr !== (0, _classPrivateFieldLooseBase2.default)(this, _tail)[_tail]) {
        keys.push(curr.key);
        curr = curr.next;
      }
      keys.push(curr.key);
    }
    return keys;
  }
  get(key) {
    const data = (0, _classPrivateFieldLooseBase2.default)(this, _data)[_data].get(key);
    if (data) {
      (0, _classPrivateFieldLooseBase2.default)(this, _toHead)[_toHead](key);
      return data;
    }
    return null;
  }
  set(key, value) {
    if ((0, _classPrivateFieldLooseBase2.default)(this, _data)[_data].has(key)) {
      (0, _classPrivateFieldLooseBase2.default)(this, _toHead)[_toHead](key);
    } else {
      const node = new LRUNode(key);
      (0, _classPrivateFieldLooseBase2.default)(this, _refs)[_refs].set(node.key, node);
      if (this.length === 0) {
        (0, _classPrivateFieldLooseBase2.default)(this, _head)[_head] = (0, _classPrivateFieldLooseBase2.default)(this, _tail)[_tail] = node;
      } else {
        (0, _classPrivateFieldLooseBase2.default)(this, _head)[_head].prev = node;
        node.next = (0, _classPrivateFieldLooseBase2.default)(this, _head)[_head];
        (0, _classPrivateFieldLooseBase2.default)(this, _head)[_head] = node;
      }
      if ((0, _classPrivateFieldLooseBase2.default)(this, _length)[_length] === this.capacity) {
        (0, _classPrivateFieldLooseBase2.default)(this, _data)[_data].delete((0, _classPrivateFieldLooseBase2.default)(this, _tail)[_tail].key);
        (0, _classPrivateFieldLooseBase2.default)(this, _refs)[_refs].delete((0, _classPrivateFieldLooseBase2.default)(this, _tail)[_tail].key);
        (0, _classPrivateFieldLooseBase2.default)(this, _tail)[_tail] = (0, _classPrivateFieldLooseBase2.default)(this, _tail)[_tail].prev;
        (0, _classPrivateFieldLooseBase2.default)(this, _tail)[_tail].next = (0, _classPrivateFieldLooseBase2.default)(this, _head)[_head];
      } else {
        (0, _classPrivateFieldLooseBase2.default)(this, _length)[_length] += 1;
      }
    }
    (0, _classPrivateFieldLooseBase2.default)(this, _data)[_data].set(key, value);
  }
}
exports.LRUCache = LRUCache;
function _toHead2(key) {
  const ref = (0, _classPrivateFieldLooseBase2.default)(this, _refs)[_refs].get(key);
  if (ref && ref !== (0, _classPrivateFieldLooseBase2.default)(this, _head)[_head]) {
    ref.prev.next = ref.next;
    ref.next.prev = ref.prev;
    ref.next = (0, _classPrivateFieldLooseBase2.default)(this, _head)[_head];
    (0, _classPrivateFieldLooseBase2.default)(this, _head)[_head].prev = ref;
    (0, _classPrivateFieldLooseBase2.default)(this, _head)[_head] = ref;
  }
}
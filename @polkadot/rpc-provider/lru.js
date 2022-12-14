import _classPrivateFieldLooseBase from "@babel/runtime/helpers/esm/classPrivateFieldLooseBase";
import _classPrivateFieldLooseKey from "@babel/runtime/helpers/esm/classPrivateFieldLooseKey";
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
var _data = /*#__PURE__*/_classPrivateFieldLooseKey("data");
var _refs = /*#__PURE__*/_classPrivateFieldLooseKey("refs");
var _length = /*#__PURE__*/_classPrivateFieldLooseKey("length");
var _head = /*#__PURE__*/_classPrivateFieldLooseKey("head");
var _tail = /*#__PURE__*/_classPrivateFieldLooseKey("tail");
var _toHead = /*#__PURE__*/_classPrivateFieldLooseKey("toHead");
export class LRUCache {
  constructor(capacity = DEFAULT_CAPACITY) {
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
    _classPrivateFieldLooseBase(this, _head)[_head] = _classPrivateFieldLooseBase(this, _tail)[_tail] = new LRUNode('<empty>');
  }
  get length() {
    return _classPrivateFieldLooseBase(this, _length)[_length];
  }
  get lengthData() {
    return _classPrivateFieldLooseBase(this, _data)[_data].size;
  }
  get lengthRefs() {
    return _classPrivateFieldLooseBase(this, _refs)[_refs].size;
  }
  entries() {
    const keys = this.keys();
    const entries = new Array(keys.length);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      entries[i] = [key, _classPrivateFieldLooseBase(this, _data)[_data].get(key)];
    }
    return entries;
  }
  keys() {
    const keys = [];
    if (_classPrivateFieldLooseBase(this, _length)[_length]) {
      let curr = _classPrivateFieldLooseBase(this, _head)[_head];
      while (curr !== _classPrivateFieldLooseBase(this, _tail)[_tail]) {
        keys.push(curr.key);
        curr = curr.next;
      }
      keys.push(curr.key);
    }
    return keys;
  }
  get(key) {
    const data = _classPrivateFieldLooseBase(this, _data)[_data].get(key);
    if (data) {
      _classPrivateFieldLooseBase(this, _toHead)[_toHead](key);
      return data;
    }
    return null;
  }
  set(key, value) {
    if (_classPrivateFieldLooseBase(this, _data)[_data].has(key)) {
      _classPrivateFieldLooseBase(this, _toHead)[_toHead](key);
    } else {
      const node = new LRUNode(key);
      _classPrivateFieldLooseBase(this, _refs)[_refs].set(node.key, node);
      if (this.length === 0) {
        _classPrivateFieldLooseBase(this, _head)[_head] = _classPrivateFieldLooseBase(this, _tail)[_tail] = node;
      } else {
        _classPrivateFieldLooseBase(this, _head)[_head].prev = node;
        node.next = _classPrivateFieldLooseBase(this, _head)[_head];
        _classPrivateFieldLooseBase(this, _head)[_head] = node;
      }
      if (_classPrivateFieldLooseBase(this, _length)[_length] === this.capacity) {
        _classPrivateFieldLooseBase(this, _data)[_data].delete(_classPrivateFieldLooseBase(this, _tail)[_tail].key);
        _classPrivateFieldLooseBase(this, _refs)[_refs].delete(_classPrivateFieldLooseBase(this, _tail)[_tail].key);
        _classPrivateFieldLooseBase(this, _tail)[_tail] = _classPrivateFieldLooseBase(this, _tail)[_tail].prev;
        _classPrivateFieldLooseBase(this, _tail)[_tail].next = _classPrivateFieldLooseBase(this, _head)[_head];
      } else {
        _classPrivateFieldLooseBase(this, _length)[_length] += 1;
      }
    }
    _classPrivateFieldLooseBase(this, _data)[_data].set(key, value);
  }
}
function _toHead2(key) {
  const ref = _classPrivateFieldLooseBase(this, _refs)[_refs].get(key);
  if (ref && ref !== _classPrivateFieldLooseBase(this, _head)[_head]) {
    ref.prev.next = ref.next;
    ref.next.prev = ref.prev;
    ref.next = _classPrivateFieldLooseBase(this, _head)[_head];
    _classPrivateFieldLooseBase(this, _head)[_head].prev = ref;
    _classPrivateFieldLooseBase(this, _head)[_head] = ref;
  }
}
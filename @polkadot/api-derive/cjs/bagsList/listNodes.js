"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.listNodes = listNodes;
var _rxjs = require("rxjs");
var _util = require("@polkadot/util");
var _util2 = require("../util");
var _util3 = require("./util");
// Copyright 2017-2022 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

function traverseLinks(api, head) {
  const subject = new _rxjs.BehaviorSubject(head);
  const query = (0, _util3.getQueryInterface)(api);
  return subject.pipe((0, _rxjs.switchMap)(account => query.listNodes(account)), (0, _rxjs.tap)(node => {
    (0, _util.nextTick)(() => {
      node.isSome && node.value.next.isSome ? subject.next(node.unwrap().next.unwrap()) : subject.complete();
    });
  }), (0, _rxjs.toArray)(),
  // toArray since we want to startSubject to be completed
  (0, _rxjs.map)(all => all.map(o => o.unwrap())));
}
function listNodes(instanceId, api) {
  return (0, _util2.memo)(instanceId, bag => bag && bag.head.isSome ? traverseLinks(api, bag.head.unwrap()) : (0, _rxjs.of)([]));
}